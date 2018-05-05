package com.basselhossam.instacapture;

import android.graphics.Bitmap;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;

import com.basselhossam.instacapture.utility.FileUtility;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import com.tarek360.instacapture.utility.Logger;
import com.tarek360.instacapture.listener.SimpleScreenCapturingListener;
import com.tarek360.instacapture.Instacapture;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class InstaCaptureModule extends ReactContextBaseJavaModule {

    public InstaCaptureModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "InstaCapture";
    }

    @ReactMethod
    public void enableLogging(Boolean enable){
        Log.d("Instacapture","enableLogging");
        if(enable)
            Logger.enable();
        else
            Logger.disable();
        Instacapture.enableLogging(enable);
    }

    @ReactMethod
    public void setJpegCompressionQuality(int quality){
        FileUtility.setJpegCompressionQuality(quality);
    }

    //Capture ScreenShot and return the absolute path in the callback function
    @ReactMethod
    public void captureScreenshot(final Callback callback){
        Logger.d("captureScreenshot");
        Instacapture.capture(getCurrentActivity(), new SimpleScreenCapturingListener() {
            @Override
            public void onCaptureComplete(Bitmap bitmap) {
                callback.invoke(FileUtility.saveBitmapToFile(getReactApplicationContext(),bitmap).getAbsolutePath());
            }
        }, null);
    }

    @ReactMethod
    public void getImages(final Callback callback){
        Logger.d("getImages");
        String screenShotsPath = FileUtility.getScreenshotsDirectoryName(getReactApplicationContext());
        Logger.d(screenShotsPath);
        File folder = new File(screenShotsPath);
        File[] listOfFiles = folder.listFiles();
        WritableArray images = Arguments.createArray();
        if(listOfFiles != null) {
            for (int i = 0; i < listOfFiles.length; i++) {
                if (listOfFiles[i].isFile()) {
                    Logger.d("File " + listOfFiles[i].getName());
                    images.pushString(listOfFiles[i].getAbsolutePath());
                }
            }
            callback.invoke(images);
        }
    }
}