package com.admeve.mahalle

import android.content.Intent
import android.net.Uri
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.myket.billingclient.IabHelper
import ir.myket.billingclient.util.Purchase
import org.json.JSONArray

/**
 * Store plugin for the Myket build: in-app billing through Myket's IabHelper, exposed to
 * the web layer as `Store` with the same methods as the Bazaar build. The helper must be
 * used on the main thread and refuses overlapping async operations, so calls are queued.
 */
@CapacitorPlugin(name = "Store")
class StorePlugin : Plugin() {
    private var helper: IabHelper? = null
    private var ready = false
    /** Purchases seen this session, by token (consume needs the Purchase object). */
    private val purchases = mutableMapOf<String, Purchase>()
    private val queue = ArrayDeque<(done: () -> Unit) -> Unit>()
    private var busy = false

    /** Runs Myket operations one at a time on the main thread. */
    private fun enqueue(op: (done: () -> Unit) -> Unit) {
        activity.runOnUiThread {
            queue.addLast(op)
            pump()
        }
    }

    private fun pump() {
        if (busy) return
        val op = queue.removeFirstOrNull() ?: return
        busy = true
        var finished = false
        op {
            activity.runOnUiThread {
                if (!finished) {
                    finished = true
                    busy = false
                    pump()
                }
            }
        }
    }

    @PluginMethod
    fun info(call: PluginCall) {
        call.resolve(
            JSObject()
                .put("store", "myket")
                .put("url", "https://myket.ir/app/" + context.packageName)
                .put("billing", BuildConfig.STORE_RSA_KEY.isNotEmpty()),
        )
    }

    @PluginMethod
    fun connect(call: PluginCall) {
        val key = BuildConfig.STORE_RSA_KEY
        if (key.isEmpty()) return call.resolve(JSObject().put("connected", false))
        enqueue { done ->
            if (ready) {
                call.resolve(JSObject().put("connected", true))
                return@enqueue done()
            }
            val h = helper ?: IabHelper(context, key).also { helper = it }
            try {
                h.startSetup { result ->
                    ready = result.isSuccess
                    call.resolve(JSObject().put("connected", ready))
                    done()
                }
            } catch (e: Exception) {
                call.resolve(JSObject().put("connected", false))
                done()
            }
        }
    }

    @PluginMethod
    fun getPrices(call: PluginCall) {
        val skus = call.getArray("skus")?.toList<String>() ?: emptyList()
        enqueue { done ->
            val h = helper
            if (h == null || !ready) {
                call.reject("not connected")
                return@enqueue done()
            }
            h.queryInventoryAsync(true, skus) { result, inv ->
                if (result.isFailure || inv == null) {
                    call.reject(result.message ?: "sku details failed")
                } else {
                    val prices = JSObject()
                    skus.forEach { sku -> inv.getSkuDetails(sku)?.let { prices.put(sku, it.price) } }
                    call.resolve(JSObject().put("prices", prices))
                }
                done()
            }
        }
    }

    @PluginMethod
    fun purchase(call: PluginCall) {
        val sku = call.getString("sku") ?: return call.reject("missing sku")
        val payload = call.getString("payload") ?: ""
        enqueue { done ->
            val h = helper
            if (h == null || !ready) {
                call.reject("not connected")
                return@enqueue done()
            }
            h.launchPurchaseFlow(activity, sku, { result, info ->
                when {
                    result.isSuccess && info != null -> {
                        purchases[info.token] = info
                        call.resolve(JSObject().put("purchaseToken", info.token).put("orderId", info.orderId))
                    }
                    result.response == IabHelper.IABHELPER_USER_CANCELLED ||
                        result.response == IabHelper.BILLING_RESPONSE_RESULT_USER_CANCELED -> call.reject("cancelled")
                    else -> call.reject(result.message ?: "purchase failed")
                }
                done()
            }, payload)
        }
    }

    @PluginMethod
    fun consume(call: PluginCall) {
        val token = call.getString("purchaseToken") ?: return call.reject("missing token")
        enqueue { done ->
            val h = helper
            if (h == null || !ready) {
                call.reject("not connected")
                return@enqueue done()
            }
            val consumeIt: (Purchase) -> Unit = { p ->
                h.consumeAsync(p) { _, result ->
                    if (result.isSuccess) {
                        purchases.remove(token)
                        call.resolve()
                    } else {
                        call.reject(result.message ?: "consume failed")
                    }
                    done()
                }
            }
            val known = purchases[token]
            if (known != null) {
                consumeIt(known)
            } else {
                h.queryInventoryAsync(false, null) { result, inv ->
                    val p = inv?.allPurchases?.firstOrNull { it.token == token }
                    if (result.isFailure || p == null) {
                        call.reject("purchase not found")
                        done()
                    } else {
                        consumeIt(p)
                    }
                }
            }
        }
    }

    @PluginMethod
    fun pending(call: PluginCall) {
        enqueue { done ->
            val h = helper
            if (h == null || !ready) {
                call.reject("not connected")
                return@enqueue done()
            }
            h.queryInventoryAsync(false, null) { result, inv ->
                if (result.isFailure || inv == null) {
                    call.reject(result.message ?: "query failed")
                } else {
                    val arr = JSONArray()
                    inv.allPurchases.forEach {
                        purchases[it.token] = it
                        arr.put(JSObject().put("sku", it.sku).put("purchaseToken", it.token))
                    }
                    call.resolve(JSObject().put("purchases", arr))
                }
                done()
            }
        }
    }

    /** Opens Myket's rating/comment page for this app. */
    @PluginMethod
    fun rate(call: PluginCall) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("myket://comment?id=" + context.packageName)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("myket not installed")
        }
    }

    override fun handleOnDestroy() {
        try {
            helper?.dispose()
        } catch (_: Exception) {
        }
        helper = null
        ready = false
        super.handleOnDestroy()
    }
}
