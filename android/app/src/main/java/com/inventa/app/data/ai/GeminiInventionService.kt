package com.inventa.app.data.ai

import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class GeminiInventionService(private val apiKey: String) {

    private val generativeModel by lazy {
        GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = apiKey
        )
    }

    suspend fun synthesizeInventions(
        problem: String,
        category: String,
        type: String,
        complexity: String
    ): Result<List<InventionConceptDto>> = withContext(Dispatchers.IO) {
        try {
            val prompt = """
                You are INVENTA's Senior Invention Architect.
                Problem: "$problem"
                Category: $category
                Invention Type: $type
                Complexity: $complexity
                
                Generate exactly 3 distinct potential solutions in valid JSON array format.
                Each solution must include: name, shortDescription, problemSolved, howItWorks,
                whatMakesInteresting, requiredMaterials, estimatedDifficulty, minCost, maxCost,
                currency, costAssumptions, potentialUsers, limitations, safetyConsiderations,
                prototypeSteps, patentResearchTips, priorArtKeywords.
            """.trimIndent()

            val response = generativeModel.generateContent(prompt)
            val jsonText = response.text?.trim() ?: throw IllegalStateException("Empty response from AI")
            
            val cleanJson = if (jsonText.startsWith("```json")) {
                jsonText.removePrefix("```json").removeSuffix("```").trim()
            } else if (jsonText.startsWith("```")) {
                jsonText.removePrefix("```").removeSuffix("```").trim()
            } else jsonText

            val jsonArray = JSONArray(cleanJson)
            val results = mutableListOf<InventionConceptDto>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                results.add(parseDto(obj))
            }
            Result.success(results)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun parseDto(obj: JSONObject): InventionConceptDto {
        return InventionConceptDto(
            name = obj.getString("name"),
            shortDescription = obj.getString("shortDescription"),
            problemSolved = obj.getString("problemSolved"),
            howItWorks = obj.getString("howItWorks"),
            whatMakesInteresting = obj.getString("whatMakesInteresting"),
            requiredMaterials = jsonArrayToList(obj.optJSONArray("requiredMaterials") ?: JSONArray()),
            estimatedDifficulty = obj.optString("estimatedDifficulty", "Intermediate"),
            minCost = obj.optDouble("minCost", 25.0),
            maxCost = obj.optDouble("maxCost", 75.0),
            currency = obj.optString("currency", "USD"),
            costAssumptions = obj.optString("costAssumptions", "Based on commodity components"),
            potentialUsers = jsonArrayToList(obj.optJSONArray("potentialUsers") ?: JSONArray()),
            limitations = jsonArrayToList(obj.optJSONArray("limitations") ?: JSONArray()),
            safetyConsiderations = jsonArrayToList(obj.optJSONArray("safetyConsiderations") ?: JSONArray()),
            patentResearchTips = obj.optString("patentResearchTips", "Search Google Patents & Espacenet"),
            priorArtKeywords = jsonArrayToList(obj.optJSONArray("priorArtKeywords") ?: JSONArray())
        )
    }

    private fun jsonArrayToList(arr: JSONArray): List<String> {
        val list = mutableListOf<String>()
        for (i in 0 until arr.length()) {
            list.add(arr.getString(i))
        }
        return list
    }
}

data class InventionConceptDto(
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
    val patentResearchTips: String,
    val priorArtKeywords: List<String>
)
