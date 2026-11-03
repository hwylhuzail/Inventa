# ==========================================
# INVENTA Android Proguard / R8 Configuration
# ==========================================

-keepattributes *Annotation*, InnerClasses, Signature, Exceptions
-keepclassmembers class * {
    @androidx.room.* <methods>;
}

# --- ROOM DATABASE ---
-keep class com.inventa.app.data.local.** { *; }
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-dontwarn androidx.room.paging.**

# --- GOOGLE GEMINI AI ---
-keep class com.google.ai.client.generativeai.** { *; }
-dontwarn com.google.ai.client.generativeai.**

# --- SUPABASE ---
-keep class io.github.jan.supabase.** { *; }
-dontwarn io.github.jan.supabase.**

# --- KTOR (Network Client) ---
-keep class io.ktor.** { *; }
-dontwarn io.ktor.**
-keepclassmembers class io.ktor.** { volatile <fields>; }

# --- KOTLIN SERIALIZATION ---
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class com.inventa.app.**$$serializer { *; }
-keepclassmembers class com.inventa.app.** {
    *** Companion;
}
-keepclasseswithmembers class com.inventa.app.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# --- GENERAL ANDROID / KOTLIN ---
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}