
package com.inventa.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.inventa.app.data.local.InventionEntity
import com.inventa.app.data.repository.InventionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface UiState {
    object Idle : UiState
    object Loading : UiState
    data class Success(val message: String) : UiState
    data class Error(val error: String) : UiState
}

class InventionViewModel(
    private val repository: InventionRepository
) : ViewModel() {

    val savedInventions: StateFlow<List<InventionEntity>> =
        repository.allInventions.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private val _generatedConcepts =
        MutableStateFlow<List<InventionEntity>>(emptyList())
    val generatedConcepts: StateFlow<List<InventionEntity>> =
        _generatedConcepts.asStateFlow()

    private val _selectedInvention =
        MutableStateFlow<InventionEntity?>(null)
    val selectedInvention: StateFlow<InventionEntity?> =
        _selectedInvention.asStateFlow()

    fun generateInventionConcepts(
        problem: String,
        category: String,
        type: String,
        complexity: String,
        targetAudience: String
    ) {
        if (problem.isBlank()) {
            _uiState.value = UiState.Error("Please describe the problem first.")
            return
        }

        viewModelScope.launch {
            _uiState.value = UiState.Loading

            try {
                val result = repository.generateConcepts(
                    problem = problem,
                    category = category,
                    type = type,
                    complexity = complexity,
                    targetAudience = targetAudience
                )

                result.onSuccess { concepts ->
                    _generatedConcepts.value = concepts
                    _uiState.value = UiState.Success(
                        "Successfully generated ${concepts.size} invention concepts"
                    )
                }.onFailure { exception ->
                    _uiState.value = UiState.Error(
                        exception.localizedMessage
                            ?: "Failed to generate invention concepts."
                    )
                }
            } catch (exception: Exception) {
                _uiState.value = UiState.Error(
                    exception.localizedMessage
                        ?: "Something went wrong."
                )
            }
        }
    }

    fun selectInvention(invention: InventionEntity?) {
        _selectedInvention.value = invention
    }

    fun saveInvention(invention: InventionEntity) {
        viewModelScope.launch {
            try {
                repository.saveInvention(invention)
                _uiState.value = UiState.Success(
                    "Invention saved to your laboratory."
                )
            } catch (exception: Exception) {
                _uiState.value = UiState.Error(
                    exception.localizedMessage ?: "Could not save invention."
                )
            }
        }
    }

    fun deleteInvention(invention: InventionEntity) {
        viewModelScope.launch {
            try {
                repository.deleteInvention(invention.id)

                if (_selectedInvention.value?.id == invention.id) {
                    _selectedInvention.value = null
                }
            } catch (exception: Exception) {
                _uiState.value = UiState.Error(
                    exception.localizedMessage ?: "Could not delete invention."
                )
            }
        }
    }

    fun updateProgress(inventionId: String, progress: Int) {
        viewModelScope.launch {
            repository.updateProgress(
                inventionId,
                progress.coerceIn(0, 100)
            )
        }
    }

    fun resetState() {
        _uiState.value = UiState.Idle
    }
}

class InventionViewModelFactory(
    private val repository: InventionRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(InventionViewModel::class.java)) {
            return InventionViewModel(repository) as T
        }

        throw IllegalArgumentException(
            "Unknown ViewModel class: ${modelClass.name}"
        )
    }
}
