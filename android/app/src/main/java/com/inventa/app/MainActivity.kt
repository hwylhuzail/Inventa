package com.inventa.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.inventa.app.ui.InventaMainScreen
import com.inventa.app.ui.theme.InventaTheme
import com.inventa.app.viewmodel.InventionViewModel
import com.inventa.app.viewmodel.InventionViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: InventionViewModel by viewModels {
        InventionViewModelFactory((application as InventaApp).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            InventaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    InventaMainScreen(viewModel = viewModel)
                }
            }
        }
    }
}
