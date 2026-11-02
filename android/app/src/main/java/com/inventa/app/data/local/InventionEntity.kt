package com.inventa.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "inventions")
data class InventionEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val shortDescription: String,
    val problemSolved: String,
    val category: String,
    val inventionType: String,
    val howItWorks: String,
    val whatMakesInteresting: String,
    val requiredMaterialsJson: String,
    val estimatedDifficulty: String,
    val minCost: Double,
    val maxCost: Double,
    val currency: String,
    val costAssumptions: String,
    val potentialUsersJson: String,
    val limitationsJson: String,
    val safetyConsiderationsJson: String,
    val prototypeStepsJson: String,
    val patentResearchTips: String,
    val priorArtKeywordsJson: String,
    val progressPercent: Int = 0,
    val isFavorite: Boolean = false,
    val userNotes: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
