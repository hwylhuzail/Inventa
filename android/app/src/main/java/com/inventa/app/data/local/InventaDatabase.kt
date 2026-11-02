package com.inventa.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [InventionEntity::class], version = 1, exportSchema = false)
abstract class InventaDatabase : RoomDatabase() {

    abstract fun inventionDao(): InventionDao

    companion object {
        @Volatile
        private var INSTANCE: InventaDatabase? = null

        fun getDatabase(context: Context): InventaDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    InventaDatabase::class.java,
                    "inventa_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
