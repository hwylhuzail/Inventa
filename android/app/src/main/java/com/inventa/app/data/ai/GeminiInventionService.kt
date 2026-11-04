
package com.inventa.app.data.ai

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

class GeminiInventionService(
    private val apiKey: String
) {

    companion object {
        private const val MODEL = "gemini-1.5-flash-8b"

        private const val BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta"

        private val JSON_MEDIA_TYPE =
            "application/json; charset=utf-8".toMediaType()
    }

    private val httpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    suspend fun synthesizeInventions(
        problem: String,
        category: String,
        type: String,
        complexity: String
    ): Result<List<InventionConceptDto>> =
        withContext(Dispatchers.IO) {

            try {

                require(apiKey.isNotBlank()) {
                    "Gemini API key is missing."
                }

                require(problem.isNotBlank()) {
                    "Please describe the problem you want to solve."
                }

                val prompt = """
                    You are INVENTA's Senior Invention Architect.

                    Your task is to generate practical, creative,
                    technically plausible invention concepts.

                    PROBLEM:
                    $problem

                    CATEGORY:
                    $category

                    INVENTION TYPE:
                    $type

                    COMPLEXITY:
                    $complexity

                    Generate exactly 3 distinct invention solutions.

                    Return ONLY a valid JSON array.
                    Do not include Markdown code fences.
                    Do not include introductory or concluding text.

                    Each array element must contain these fields:

                    {
                      "name": "Invention name",
                      "shortDescription": "Short description",
                      "problemSolved": "Problem addressed",
                      "howItWorks": "Detailed explanation",
                      "whatMakesInteresting": "Unique features",
                      "requiredMaterials": ["Material 1", "Material 2"],
                      "estimatedDifficulty": "Beginner, Intermediate or Advanced",
                      "minCost": 25.0,
                      "maxCost": 75.0,
                      "currency": "USD",
                      "costAssumptions": "Cost explanation",
                      "potentialUsers": ["User group 1", "User group 2"],
                      "limitations": ["Limitation 1"],
                      "safetyConsiderations": ["Safety consideration 1"],
                      "prototypeSteps": ["Step 1", "Step 2"],
                      "patentResearchTips": "Patent research guidance",
                      "priorArtKeywords": ["Keyword 1", "Keyword 2"]
                    }

                    IMPORTANT:
                    1. Return exactly 3 different inventions.
                    2. Make the solutions technically realistic.
                    3. Include affordable materials where possible.
                    4. Provide realistic cost estimates.
                    5. Include practical prototype steps.
                    6. Identify safety risks honestly.
                    7. Avoid copying existing commercial products.
                    8. Do not claim that an invention is patentable.
                    9. All fields must be present.
                    10. Use arrays for list fields.
                    11. Costs must be numeric values.
                    12. Return valid JSON only.
                """.trimIndent()

                val requestJson = JSONObject().apply {

                    put(
                        "contents",
                        JSONArray().put(
                            JSONObject().apply {
                                put(
                                    "parts",
                                    JSONArray().put(
                                        JSONObject().put("text", prompt)
                                    )
                                )
                            }
                        )
                    )

                    put(
                        "generationConfig",
                        JSONObject().apply {
                            put("temperature", 0.7)
                            put("topP", 0.9)
                            put("maxOutputTokens", 8192)
                            put("responseMimeType", "application/json")
                        }
                    )
                }

                val url = okhttp3.HttpUrl.Builder()
                    .scheme("https")
                    .host("generativelanguage.googleapis.com")
                    .addPathSegment("v1beta")
                    .addPathSegment("models")
                    .addPathSegment("$MODEL:generateContent")
                    .addQueryParameter("key", apiKey)
                    .build()

                val request = Request.Builder()
                    .url(url)
                    .post(
                        requestJson.toString()
                            .toRequestBody(JSON_MEDIA_TYPE)
                    )
                    .addHeader("Content-Type", "application/json")
                    .build()

                val responseText = httpClient.newCall(request)
                    .execute()
                    .use { response ->

                        val body = response.body?.string()
                            ?: throw IOException(
                                "Gemini returned an empty response."
                            )

                        if (!response.isSuccessful) {

                            val errorMessage = try {
                                JSONObject(body)
                                    .optJSONObject("error")
                                    ?.optString("message")
                            } catch (_: Exception) {
                                null
                            }

                            throw IOException(
                                errorMessage?.takeIf { it.isNotBlank() }
                                    ?: "Gemini API request failed: HTTP ${response.code}"
                            )
                        }

                        body
                    }

                val responseJson = JSONObject(responseText)

                val candidates = responseJson.optJSONArray("candidates")
                    ?: throw IOException(
                        "Gemini did not return any candidates."
                    )

                if (candidates.length() == 0) {
                    throw IOException(
                        "Gemini could not generate inventions. Please try again."
                    )
                }

                val candidate = candidates.getJSONObject(0)

                val content = candidate.optJSONObject("content")
                    ?: throw IOException(
                        "Gemini returned an invalid response."
                    )

                val parts = content.optJSONArray("parts")
                    ?: throw IOException(
                        "Gemini response contains no text."
                    )

                val textBuilder = StringBuilder()

                for (i in 0 until parts.length()) {
                    val part = parts.optJSONObject(i)
                    val text = part?.optString("text", "")
                    if (!text.isNullOrBlank()) {
                        textBuilder.append(text)
                    }
                }

                val jsonText = textBuilder.toString().trim()

                if (jsonText.isBlank()) {
                    throw IOException(
                        "Gemini returned empty invention data."
                    )
                }

                val cleanJson = cleanJsonResponse(jsonText)

                val jsonArray = JSONArray(cleanJson)

                if (jsonArray.length() != 3) {
                    throw IOException(
                        "Expected exactly 3 invention concepts, " +
                            "but received ${jsonArray.length()}. Please try again."
                    )
                }

                val inventions = mutableListOf<InventionConceptDto>()

                for (i in 0 until jsonArray.length()) {
                    inventions.add(
                        parseDto(jsonArray.getJSONObject(i))
                    )
                }

                Result.success(inventions)

            } catch (e: Exception) {

                Result.failure(e)
            }
        }

    private fun cleanJsonResponse(text: String): String {

        var result = text.trim()

        if (result.startsWith("```json", ignoreCase = true)) {
            result = result.substringAfter('\n')
        } else if (result.startsWith("```")) {
            result = result.substringAfter('\n')
        }

        if (result.endsWith("```")) {
            result = result.removeSuffix("```")
        }

        return result.trim()
    }

    private fun parseDto(
        obj: JSONObject
    ): InventionConceptDto {

        return InventionConceptDto(

            name = obj.getString("name"),

            shortDescription =
                obj.getString("shortDescription"),

            problemSolved =
                obj.getString("problemSolved"),

            howItWorks =
                obj.getString("howItWorks"),

            whatMakesInteresting =
                obj.getString("whatMakesInteresting"),

            requiredMaterials =
                jsonArrayToList(
                    obj.optJSONArray("requiredMaterials")
                ),

            estimatedDifficulty =
                obj.optString(
                    "estimatedDifficulty",
                    "Intermediate"
                ),

            minCost =
                obj.optDouble("minCost", 25.0),

            maxCost =
                obj.optDouble("maxCost", 75.0),

            currency =
                obj.optString("currency", "USD"),

            costAssumptions =
                obj.optString(
                    "costAssumptions",
                    "Based on commodity components"
                ),

            potentialUsers =
                jsonArrayToList(
                    obj.optJSONArray("potentialUsers")
                ),

            limitations =
                jsonArrayToList(
                    obj.optJSONArray("limitations")
                ),

            safetyConsiderations =
                jsonArrayToList(
                    obj.optJSONArray("safetyConsiderations")
                ),

            patentResearchTips =
                obj.optString(
                    "patentResearchTips",
                    "Search Google Patents and Espacenet"
                ),

            priorArtKeywords =
                jsonArrayToList(
                    obj.optJSONArray("priorArtKeywords")
                )
        )
    }

    private fun jsonArrayToList(
        array: JSONArray?
    ): List<String> {

        if (array == null) return emptyList()

        val result = mutableListOf<String>()

        for (i in 0 until array.length()) {

            val value = array.optString(i, "")

            if (value.isNotBlank()) {
                result.add(value)
            }
        }

        return result
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
