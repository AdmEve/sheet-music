package com.admeve.mahalle

import android.content.Intent
import android.net.Uri
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.cafebazaar.poolakey.Connection
import ir.cafebazaar.poolakey.ConnectionState
import ir.cafebazaar.poolakey.Payment
import ir.cafebazaar.poolakey.config.PaymentConfiguration
import ir.cafebazaar.poolakey.config.SecurityCheck
import ir.cafebazaar.poolakey.request.PurchaseRequest
import org.json.JSONArray

/**
 * Store plugin for the Cafe Bazaar build: in-app billing through Poolakey, exposed to the
 * web layer as `Store`. Purchases are verified locally with the app's RSA key from the
 * Bazaar developer panel (BuildConfig.STORE_RSA_KEY, injected by CI).
 */
@CapacitorPlugin(name = "Store")
class StorePlugin : Plugin() {
    private var payment: Payment? = null
    private var connection: Connection? = null
    /** connect() calls waiting for the handshake; all are answered together. */
    private val waiting = mutableListOf<PluginCall>()

    private fun answerWaiting(connected: Boolean) {
        val calls = waiting.toList()
        waiting.clear()
        calls.forEach { it.resolve(JSObject().put("connected", connected)) }
    }

    @PluginMethod
    fun info(call: PluginCall) {
        call.resolve(
            JSObject()
                .put("store", "bazaar")
                .put("url", "https://cafebazaar.ir/app/" + context.packageName)
                .put("billing", BuildConfig.STORE_RSA_KEY.isNotEmpty()),
        )
    }

    @PluginMethod
    fun connect(call: PluginCall) {
        val key = BuildConfig.STORE_RSA_KEY
        if (key.isEmpty()) return call.resolve(JSObject().put("connected", false))
        if (connection?.getState() == ConnectionState.Connected) {
            return call.resolve(JSObject().put("connected", true))
        }
        waiting.add(call)
        if (waiting.size > 1) return // a handshake is already in progress
        val p = Payment(context, PaymentConfiguration(localSecurityCheck = SecurityCheck.Enable(rsaPublicKey = key)))
        payment = p
        connection = p.connect {
            connectionSucceed { answerWaiting(true) }
            connectionFailed { answerWaiting(false) }
            disconnected {
                connection = null
                payment = null
                answerWaiting(false)
                notifyListeners("disconnected", JSObject())
            }
        }
    }

    @PluginMethod
    fun getPrices(call: PluginCall) {
        val p = payment ?: return call.reject("not connected")
        val skus = call.getArray("skus")?.toList<String>() ?: emptyList()
        p.getInAppSkuDetails(skus) {
            getSkuDetailsSucceed { list ->
                val prices = JSObject()
                list.forEach { prices.put(it.sku, it.price) }
                call.resolve(JSObject().put("prices", prices))
            }
            getSkuDetailsFailed { call.reject(it.message ?: "sku details failed") }
        }
    }

    @PluginMethod
    fun purchase(call: PluginCall) {
        val p = payment ?: return call.reject("not connected")
        val sku = call.getString("sku") ?: return call.reject("missing sku")
        val payload = call.getString("payload")
        val registry = activity?.activityResultRegistry ?: return call.reject("no activity")
        activity.runOnUiThread {
            p.purchaseProduct(registry, PurchaseRequest(productId = sku, payload = payload)) {
                purchaseSucceed { info ->
                    call.resolve(JSObject().put("purchaseToken", info.purchaseToken).put("orderId", info.orderId))
                }
                purchaseCanceled { call.reject("cancelled") }
                purchaseFailed { call.reject(it.message ?: "purchase failed") }
                failedToBeginFlow { call.reject(it.message ?: "could not start purchase") }
            }
        }
    }

    @PluginMethod
    fun consume(call: PluginCall) {
        val p = payment ?: return call.reject("not connected")
        val token = call.getString("purchaseToken") ?: return call.reject("missing token")
        p.consumeProduct(token) {
            consumeSucceed { call.resolve() }
            consumeFailed { call.reject(it.message ?: "consume failed") }
        }
    }

    @PluginMethod
    fun pending(call: PluginCall) {
        val p = payment ?: return call.reject("not connected")
        p.getPurchasedProducts {
            querySucceed { list ->
                val arr = JSONArray()
                list.forEach { arr.put(JSObject().put("sku", it.productId).put("purchaseToken", it.purchaseToken)) }
                call.resolve(JSObject().put("purchases", arr))
            }
            queryFailed { call.reject(it.message ?: "query failed") }
        }
    }

    /** Opens Bazaar's rating/comment screen for this app. */
    @PluginMethod
    fun rate(call: PluginCall) {
        try {
            val intent = Intent(Intent.ACTION_EDIT).apply {
                data = Uri.parse("bazaar://details?id=" + context.packageName)
                setPackage("com.farsitel.bazaar")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("bazaar not installed")
        }
    }

    override fun handleOnDestroy() {
        connection?.disconnect()
        connection = null
        super.handleOnDestroy()
    }
}
