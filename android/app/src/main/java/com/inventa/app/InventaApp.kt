package com.inventa.app

import android.app.Application
import com.inventa.app.data.local.InventaDatabase
import com.inventa.app.data.repository.InventionRepository

class InventaApp : Application() {

    val database by lazy { InventaDatabase.getDatabase(this) }
    val repository by lazy { InventionRepository(database.inventionDao()) }

    override fun onCreate() {
        super.onCreate()
    }
}
