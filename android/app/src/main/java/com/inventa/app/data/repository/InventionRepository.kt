
package com.inventa.app.data.repository

import com.inventa.app.data.local.InventionDao
import com.inventa.app.data.local.InventionEntity
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.functions.functions
import io.ktor.client.call.body
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.UUID

class InventionRepository(
    private val inventionDao: InventionDao,
    private val supabaseClient: SupabaseClient?
) {

    val allInventions: Flow<List<InventionEntity>> =
        inventionDao.getAllInventions()

    val favoriteInventions: Flow<List<InventionEntity>> =
        inventionDao.getFavoriteInventions()

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
        inventionDao.updateProgress(id, progress.coerceIn(0, 100))
    }

    suspend fun generateConcepts(
        problem: String,
        category: String,
        type: String,
        complexity: String,
        targetAudience: String
    ): Result<List<InventionEntity>> {

        return try {
            val client = supabaseClient
                ?: throw IllegalStateException(
                    "Supabase is not configured. Check your app configuration."
                )

            require(problem.isNotBlank()) {
                "Please describe the problem."
            }

            val response = client.functions.invoke(
                function = "generate-concepts",
                body = GenerateConceptsRequest(
                    problem = problem,
                    category = category,
                    type = type,
                    complexity = complexity,
                    targetAudience = targetAudience
                )
            )

            val result = response.body<GenerateConceptsResponse>()

            if (result.concepts.size != 3) {
                throw IllegalStateException(
                    "The AI service did not return exactly three concepts."
                )
            }

            val concepts = result.concepts.map { concept ->
                InventionEntity(
                    id = UUID.randomUUID().toString(),
                    name = concept.name,
                    shortDescription = concept.shortDescription,
                    problemSolved = concept.problemSolved,
                    category = category,
                    inventionType = type,
                    howItWorks = concept.howItWorks,
                    whatMakesInteresting = concept.whatMakesInteresting,
                    requiredMaterialsJson =
                        Json.encodeToString(concept.requiredMaterials),
                    estimatedDifficulty = concept.estimatedDifficulty,
                    minCost = concept.minCost,
                    maxCost = concept.maxCost,
                    currency = concept.currency,
                    costAssumptions = concept.costAssumptions,
                    potentialUsersJson =
                        Json.encodeToString(concept.potentialUsers),
                    limitationsJson =
                        Json.encodeToString(concept.limitations),
                    safetyConsiderationsJson =
                        Json.encodeToString(concept.safetyConsiderations),
                    prototypeStepsJson =
                        Json.encodeToString(concept.prototypeSteps),
                    patentResearchTips = concept.patentResearchTips,
                    priorArtKeywordsJson =
                        Json.encodeToString(concept.priorArtKeywords)
                )
            }

            Result.success(concepts)

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }
}

@Serializable
data class GenerateConceptsRequest(
    val problem: String,
    val category: String,
    val type: String,
    val complexity: String,
    val targetAudience: String
)

@Serializable
data class GenerateConceptsResponse(
    val concepts: List<InventionConceptResponse>
)

@Serializable
data class InventionConceptResponse(
    val name: String,
    val shortDescription: String,
    val problemSolved: String,
    val howItWorks: String,
    val whatMakesInteresting: String,
    val requiredMaterials: List<String>,
    val estimatedDifficulty: String,
    val minCost: Double,
    val maxCost: Double,
    val currency: String,
    val costAssumptions: String,
    val potentialUsers: List<String>,
    val limitations: List<String>,
    val safetyConsiderations: List<String>,
    val prototypeSteps: List<String>,
    val patentResearchTips: String,
    val priorArtKeywords: List<String>
)
