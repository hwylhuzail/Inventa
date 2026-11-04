package com.inventa.app

import android.app.Application
import com.inventa.app.data.local.InventaDatabase
import com.inventa.app.data.remote.SupabaseClientProvider
import com.inventa.app.data.repository.InventionRepository
import io.github.jan.supabase.SupabaseClient

class InventaApp : Application() {

    val database by lazy {
        InventaDatabase.getDatabase(this)
    }

    val supabaseClient: SupabaseClient? by lazy {
        val url = BuildConfig.SUPABASE_URL
        val key = BuildConfig.SUPABASE_PUBLISHABLE_KEY

        if (url.isNotBlank() && key.isNotBlank()) {
            SupabaseClientProvider.initialize(
                supabaseUrl = url,
                supabasePublishableKey = key
            )
        } else {
            null
        }
    }

    val repository by lazy {
        InventionRepository(
            inventionDao = database.inventionDao(),
            supabaseClient = supabaseClient
        )
    }

    override fun onCreate() {
        super.onCreate()
    }
}