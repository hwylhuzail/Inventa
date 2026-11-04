package com.inventa.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.inventa.app.ui.theme.*
import com.inventa.app.viewmodel.InventionViewModel

enum class NavigationSection(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    HOME("Home", Icons.Filled.Home, Icons.Outlined.Home),
    DISCOVER("Discover", Icons.Filled.Explore, Icons.Outlined.Explore),
    CREATE("Create", Icons.Filled.AddCircle, Icons.Outlined.AddCircle),
    MY_INVENTIONS("My Inventions", Icons.Filled.Folder, Icons.Outlined.Folder),
    PROFILE("Profile", Icons.Filled.Person, Icons.Outlined.Person)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventaMainScreen(viewModel: InventionViewModel) {
    var currentSection by remember { mutableStateOf(NavigationSection.HOME) }
    val savedInventions by viewModel.savedInventions.collectAsState()
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    Brush.linearGradient(
                                        listOf(ElectricViolet, CyanAccent)
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Lightbulb,
                                contentDescription = "Logo",
                                tint = DarkNavy,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "INVENTA",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = androidx.compose.ui.unit.TextUnit(1.5f, androidx.compose.ui.unit.TextUnitType.Sp)
                                ),
                                color = TextPrimary
                            )
                            Text(
                                text = "Imagine. Invent. Create.",
                                style = MaterialTheme.typography.labelSmall,
                                color = CyanAccent
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { /* Open Gemini Copilot */ }) {
                        Icon(
                            imageVector = Icons.Filled.AutoAwesome,
                            contentDescription = "AI Mentor",
                            tint = CyanAccent
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = CharcoalSurface,
                tonalElevation = 8.dp
            ) {
                NavigationSection.values().forEach { section ->
                    val isSelected = currentSection == section
                    val isCreate = section == NavigationSection.CREATE

                    if (isCreate) {
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { currentSection = section },
                            icon = {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .background(
                                            Brush.linearGradient(
                                                listOf(ElectricViolet, CyanAccent)
                                            )
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Add,
                                        contentDescription = "New Invention",
                                        tint = DarkNavy,
                                        modifier = Modifier.size(26.dp)
                                    )
                                }
                            },
                            label = { Text("Invent", color = if (isSelected) CyanAccent else TextSecondary) },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = androidx.compose.ui.graphics.Color.Transparent
                            )
                        )
                    } else {
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { currentSection = section },
                            icon = {
                                Icon(
                                    imageVector = if (isSelected) section.selectedIcon else section.unselectedIcon,
                                    contentDescription = section.title,
                                    tint = if (isSelected) CyanAccent else TextSecondary
                                )
                            },
                            label = {
                                Text(
                                    text = section.title,
                                    color = if (isSelected) CyanAccent else TextSecondary,
                                    style = MaterialTheme.typography.labelSmall
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = ElectricVioletDark.copy(alpha = 0.3f)
                            )
                        )
                    }
                }
            }
        },
        containerColor = DarkNavy
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (currentSection) {
                NavigationSection.HOME -> HomeSectionView(
                    onCreateClick = { currentSection = NavigationSection.CREATE },
                    savedCount = savedInventions.size
                )
                NavigationSection.DISCOVER -> DiscoverSectionView()
                NavigationSection.CREATE -> CreateSectionView(viewModel = viewModel)
                NavigationSection.MY_INVENTIONS -> MyInventionsSectionView(
                    inventions = savedInventions,
                    onDelete = { viewModel.deleteInvention(it) }
                )
                NavigationSection.PROFILE -> ProfileSectionView()
            }
        }
    }
}

@Composable
fun HomeSectionView(onCreateClick: () -> Unit, savedCount: Int) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "INVENTION LAB OVERVIEW",
                    style = MaterialTheme.typography.labelSmall,
                    color = CyanAccent
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Welcome to INVENTA",
                    style = MaterialTheme.typography.headlineMedium,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Transform everyday problems into verified, production-grade inventions with Gemini AI.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = onCreateClick,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Filled.Add, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Start New Invention", color = TextPrimary)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            MetricCard(
                title = "Saved Concepts",
                value = savedCount.toString(),
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Engine",
                value = "Groq AI",
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun MetricCard(title: String, value: String, modifier: Modifier = Modifier) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, style = MaterialTheme.typography.titleLarge, color = CyanAccent)
        }
    }
}

@Composable
fun DiscoverSectionView() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Invention Discovery Lab & Global Registry", color = TextSecondary)
    }
}

@Composable
fun CreateSectionView(viewModel: InventionViewModel) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("AI Invention Studio & Multimodal Capture", color = TextSecondary)
    }
}

@Composable
fun MyInventionsSectionView(inventions: List<com.inventa.app.data.local.InventionEntity>, onDelete: (com.inventa.app.data.local.InventionEntity) -> Unit) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Saved Inventions Repository (${inventions.size})", color = TextSecondary)
    }
}

@Composable
fun ProfileSectionView() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Inventor Profile & Laboratory Settings", color = TextSecondary)
    }
}
