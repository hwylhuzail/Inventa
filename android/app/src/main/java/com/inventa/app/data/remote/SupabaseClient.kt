
package com.inventa.app.data.remote

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.functions.Functions
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage

object SupabaseClientProvider {

    @Volatile
    private var instance: SupabaseClient? = null

    fun initialize(
        supabaseUrl: String,
        supabasePublishableKey: String
    ): SupabaseClient {
        require(supabaseUrl.startsWith("https://")) {
            "A valid HTTPS Supabase URL is required."
        }

        require(supabasePublishableKey.isNotBlank()) {
            "Supabase publishable key is missing."
        }

        return instance ?: synchronized(this) {
            instance ?: createSupabaseClient(
                supabaseUrl = supabaseUrl,
                supabaseKey = supabasePublishableKey
            ) {
                install(Auth)
                install(Postgrest)
                install(Storage)
                install(Functions)
            }.also { instance = it }
        }
    }
}
