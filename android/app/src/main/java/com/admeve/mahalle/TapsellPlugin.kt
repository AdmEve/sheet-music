package com.admeve.mahalle

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.tapsell.plus.AdRequestCallback
import ir.tapsell.plus.AdShowListener
import ir.tapsell.plus.TapsellPlus
import ir.tapsell.plus.TapsellPlusInitListener
import ir.tapsell.plus.model.AdNetworkError
import ir.tapsell.plus.model.AdNetworks
import ir.tapsell.plus.model.TapsellPlusAdModel
import ir.tapsell.plus.model.TapsellPlusErrorModel

/** Tapsell Plus rewarded video exposed to the web layer as `Tapsell`. */
@CapacitorPlugin(name = "Tapsell")
class TapsellPlugin : Plugin() {

    @PluginMethod
    fun init(call: PluginCall) {
        val key = call.getString("appKey").orEmpty()
        if (key.isEmpty()) return call.reject("missing appKey")
        activity.runOnUiThread {
            TapsellPlus.initialize(activity, key, object : TapsellPlusInitListener {
                override fun onInitializeSuccess(adNetworks: AdNetworks) {
                    call.resolve()
                }

                override fun onInitializeFailed(adNetworks: AdNetworks, error: AdNetworkError) {
                    call.reject(error.errorMessage ?: "init failed")
                }
            })
        }
    }

    /** Requests then immediately shows a rewarded video; resolves with whether it was earned. */
    @PluginMethod
    fun showRewarded(call: PluginCall) {
        val zone = call.getString("zoneId") ?: return call.reject("missing zoneId")
        activity.runOnUiThread {
            TapsellPlus.requestRewardedVideoAd(activity, zone, object : AdRequestCallback() {
                override fun response(model: TapsellPlusAdModel) {
                    super.response(model)
                    var rewarded = false
                    TapsellPlus.showRewardedVideoAd(activity, model.responseId, object : AdShowListener() {
                        override fun onRewarded(m: TapsellPlusAdModel) {
                            super.onRewarded(m)
                            rewarded = true
                        }

                        override fun onClosed(m: TapsellPlusAdModel) {
                            super.onClosed(m)
                            call.resolve(JSObject().put("rewarded", rewarded))
                        }

                        override fun onError(e: TapsellPlusErrorModel) {
                            super.onError(e)
                            call.resolve(JSObject().put("rewarded", false))
                        }
                    })
                }

                override fun error(message: String) {
                    super.error(message)
                    call.resolve(JSObject().put("rewarded", false))
                }
            })
        }
    }
}
