package com.inventa.app.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface InventionDao {
    @Query("SELECT * FROM inventions ORDER BY updatedAt DESC")
    fun getAllInventions(): Flow<List<InventionEntity>>

    @Query("SELECT * FROM inventions WHERE id = :id")
    suspend fun getInventionById(id: String): InventionEntity?

    @Query("SELECT * FROM inventions WHERE isFavorite = 1 ORDER BY updatedAt DESC")
    fun getFavoriteInventions(): Flow<List<InventionEntity>>

    @Query("SELECT * FROM inventions WHERE category = :category ORDER BY updatedAt DESC")
    fun getInventionsByCategory(category: String): Flow<List<InventionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertInvention(invention: InventionEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(inventions: List<InventionEntity>): List<Long>

    @Update
    suspend fun updateInvention(invention: InventionEntity): Int

    @Query("DELETE FROM inventions WHERE id = :id")
    suspend fun deleteInventionById(id: String): Int

    @Query("UPDATE inventions SET isFavorite = NOT isFavorite WHERE id = :id")
    suspend fun toggleFavorite(id: String): Int

    @Query("UPDATE inventions SET progressPercent = :progress WHERE id = :id")
    suspend fun updateProgress(id: String, progress: Int): Int
}