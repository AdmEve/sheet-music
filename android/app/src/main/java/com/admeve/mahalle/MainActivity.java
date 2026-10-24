package com.admeve.mahalle;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(StorePlugin.class); // per-store implementation in src/bazaar or src/myket
        registerPlugin(TapsellPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
