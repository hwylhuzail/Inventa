package com.inventa.app.data.repository

import com.inventa.app.data.local.InventionDao
import com.inventa.app.data.local.InventionEntity
import kotlinx.coroutines.flow.Flow

class InventionRepository(private val inventionDao: InventionDao) {

    val allInventions: Flow<List<InventionEntity>> = inventionDao.getAllInventions()
    val favoriteInventions: Flow<List<InventionEntity>> = inventionDao.getFavoriteInventions()

    suspend fun getInventionById(id: String): InventionEntity? {
        return inventionDao.getInventionById(id)
    }

    fun getInventionsByCategory(category: String): Flow<List<InventionEntity>> {
        return inventionDao.getInventionsByCategory(category)
    }

    suspend fun saveInvention(invention: InventionEntity) {
        inventionDao.insertInvention(invention)
    }

    suspend fun saveAll(inventions: List<InventionEntity>) {
        inventionDao.insertAll(inventions)
    }

    suspend fun updateInvention(invention: InventionEntity) {
        inventionDao.updateInvention(invention)
    }

    suspend fun deleteInvention(id: String) {
        inventionDao.deleteInventionById(id)
    }

    suspend fun toggleFavorite(id: String) {
        inventionDao.toggleFavorite(id)
    }

    suspend fun updateProgress(id: String, progress: Int) {
        inventionDao.updateProgress(id, progress)
    }
}
