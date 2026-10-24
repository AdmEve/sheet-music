package com.admeve.mahalle;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BazaarPlugin.class);
        registerPlugin(TapsellPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
