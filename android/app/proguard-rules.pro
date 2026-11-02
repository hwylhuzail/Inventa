# INVENTA Android Proguard / R8 Configuration
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* <methods>;
}
-keep class com.inventa.app.data.local.** { *; }
-keep class com.google.ai.client.generativeai.** { *; }
