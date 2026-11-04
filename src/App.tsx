/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, Invention, UserProfile } from './types/invention';
import { StorageService } from './services/storage';
import { InventaApi } from './services/inventaApi';

// Common Components
import { AndroidFrame } from './components/common/AndroidFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CreateInventionScreen } from './components/screens/CreateInventionScreen';
import { GeneratingScreen } from './components/screens/GeneratingScreen';
import { GeneratedResultsScreen } from './components/screens/GeneratedResultsScreen';
import { InventionDetailScreen } from './components/screens/InventionDetailScreen';
import { ComparisonScreen } from './components/screens/ComparisonScreen';
import { PrototypeStudioScreen } from './components/screens/PrototypeStudioScreen';
import { MyInventionsScreen } from './components/screens/MyInventionsScreen';
import { DiscoveryLabScreen } from './components/screens/DiscoveryLabScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DataExportScreen } from './components/screens/DataExportScreen';
import { AndroidCodeViewerScreen } from './components/screens/AndroidCodeViewerScreen';

export default function App() {
  // Screen state & navigation back-stack
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() =>
    StorageService.hasAcceptedTerms() ? 'home' : 'splash'
  );
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>(() =>
    StorageService.hasAcceptedTerms() ? ['home'] : ['splash']
  );

  // Data state
  const [inventions, setInventions] = useState<Invention[]>(() => StorageService.getInventions());
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [selectedInvention, setSelectedInvention] = useState<Invention | null>(null);
  const [generatedBatch, setGeneratedBatch] = useState<Invention[]>([]);
  const [activeProblemText, setActiveProblemText] = useState<string>('');
  const [comparisonBatch, setComparisonBatch] = useState<Invention[]>([]);

  // Theme & presentation mode
  const [isDark, setIsDark] = useState<boolean>(() => StorageService.getThemeMode() === 'dark');
  const [isFramed, setIsFramed] = useState<boolean>(() => StorageService.getDeviceFrameMode());

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme
  useEffect(() => {
    StorageService.setThemeMode(isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    StorageService.setDeviceFrameMode(isFramed);
  }, [isFramed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Navigation handlers
  const navigateTo = (screen: AppScreen) => {
    if (screen === currentScreen) return;
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop(); // remove current
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  // Actions
  const handleStartWithProblem = (problemText: string) => {
    setActiveProblemText(problemText);
    navigateTo('create');
  };

  const handleSelectInvention = (inv: Invention) => {
    setSelectedInvention(inv);
    navigateTo('detail');
  };

  const handleOpenPrototype = (inv: Invention) => {
    setSelectedInvention(inv);
    navigateTo('prototype');
  };

  const handleOpenAssistant = (inv: Invention | null) => {
    setSelectedInvention(inv);
    navigateTo('assistant');
  };

  const handleOpenComparison = (items: Invention[]) => {
    setComparisonBatch(items.length > 0 ? items : inventions.slice(0, 3));
    navigateTo('compare');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = StorageService.toggleFavorite(id);
    setInventions(updated);
    if (selectedInvention?.id === id) {
      const found = updated.find((i) => i.id === id);
      if (found) setSelectedInvention(found);
    }
    showToast('Vault updated');
  };

  const handleUpdateInvention = (updated: Invention) => {
    const newList = StorageService.updateInvention(updated);
    setInventions(newList);
    if (selectedInvention?.id === updated.id) {
      setSelectedInvention(updated);
    }
    showToast('Changes saved to local vault');
  };

  const handleDeleteInvention = (id: string) => {
    const newList = StorageService.deleteInvention(id);
    setInventions(newList);
    if (selectedInvention?.id === id) {
      setSelectedInvention(null);
      navigateTo('my-inventions');
    }
    showToast('Project removed');
  };

  const handleSaveToVault = (inv: Invention) => {
    const updated = StorageService.addInvention(inv);
    setInventions(updated);
    showToast(`"${inv.name}" saved to My Inventions`);
  };

  const handleExportMarkdown = (inv: Invention) => {
    const md = StorageService.exportInventionAsMarkdown(inv);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_spec.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Engineering report downloaded');
  };

  // Synthesize Workflow
  const handleGenerateSubmit = async (params: {
    problem: string;
    category: any;
    inventionType: any;
    complexity: any;
    imageDataUrl?: string;
  }) => {
    setActiveProblemText(params.problem);
    navigateTo('generating');

    try {
      const res = await InventaApi.generateInventions(params);
      const generated = res.inventions.map((inv) => ({
        ...inv,
        category: params.category,
        inventionType: params.inventionType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setGeneratedBatch(generated);
      // Auto-save generated concepts to library
      generated.forEach((g) => StorageService.addInvention(g));
      setInventions(StorageService.getInventions());

      navigateTo('results');
    } catch (err: any) {
      console.error('Synthesis error:', err);
      showToast(err.message || 'AI synthesis failed. Check your connection and try again.');
      navigateTo('create');
    }
  };

  const handleDataWiped = () => {
    setInventions(StorageService.getInventions());
    setProfile(StorageService.getProfile());
    setSelectedInvention(null);
    navigateTo('home');
    showToast('All local records purged');
  };

  // Determine header behavior
  const showHeader = !['splash', 'onboarding'].includes(currentScreen);
  const showBottomNav = !['splash', 'onboarding', 'generating', 'auth'].includes(currentScreen);
  const showBackButton = ['detail', 'compare', 'prototype', 'settings', 'data-export', 'android-code'].includes(currentScreen);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'detail':
        return selectedInvention ? selectedInvention.name : 'Invention Detail';
      case 'prototype':
        return 'Prototype Studio';
      case 'compare':
        return 'Solution Comparison';
      case 'settings':
        return 'Settings & Privacy';
      case 'data-export':
        return 'Data Vault Management';
      case 'android-code':
        return 'Android Kotlin Studio';
      case 'assistant':
        return 'AI Engineering Mentor';
      default:
        return undefined;
    }
  };

  return (
    <AndroidFrame
      isFramed={isFramed}
      onToggleFrame={() => setIsFramed(!isFramed)}
      isDark={isDark}
      onToggleDark={() => setIsDark(!isDark)}
      onOpenAndroidCode={() => navigateTo('android-code')}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold shadow-xl shadow-black/40 border border-violet-400/30 transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Application Header */}
      {showHeader && (
        <Header
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onBack={handleBack}
          title={getScreenTitle()}
          showBack={showBackButton}
        />
      )}

      {/* Main Screen Content Viewport */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {currentScreen === 'splash' && (
          <SplashScreen
            onStart={() => navigateTo('onboarding')}
            onExploreDirectly={() => navigateTo('auth')}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            onComplete={() => navigateTo('auth')}
            onSkip={() => navigateTo('auth')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onSuccess={(p) => {
              setProfile(p);
              StorageService.saveProfile(p);
              navigateTo('home');
            }}
            onContinueGuest={() => navigateTo('home')}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            profile={profile}
            inventions={inventions}
            onNavigate={navigateTo}
            onSelectInvention={handleSelectInvention}
            onStartWithProblem={handleStartWithProblem}
          />
        )}

        {currentScreen === 'create' && (
          <CreateInventionScreen
            initialProblem={activeProblemText}
            onSubmit={handleGenerateSubmit}
            onCancel={() => navigateTo('home')}
          />
        )}

        {currentScreen === 'generating' && (
          <GeneratingScreen problem={activeProblemText || 'Observation synthesis'} />
        )}

        {currentScreen === 'results' && (
          <GeneratedResultsScreen
            inventions={generatedBatch.length > 0 ? generatedBatch : inventions.slice(0, 3)}
            onSelectInvention={handleSelectInvention}
            onOpenPrototype={handleOpenPrototype}
            onCompare={handleOpenComparison}
            onSaveToVault={handleSaveToVault}
            savedIds={inventions.map((i) => i.id)}
          />
        )}

        {currentScreen === 'detail' && selectedInvention && (
          <InventionDetailScreen
            invention={selectedInvention}
            onOpenPrototype={handleOpenPrototype}
            onOpenAssistant={handleOpenAssistant}
            onOpenRefine={(inv) => {
              setSelectedInvention(inv);
              navigateTo('discover');
            }}
            onToggleFavorite={handleToggleFavorite}
            onExportReport={handleExportMarkdown}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'compare' && (
          <ComparisonScreen
            inventions={comparisonBatch.length > 0 ? comparisonBatch : inventions.slice(0, 3)}
            onSelectForPrototype={handleOpenPrototype}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'prototype' && selectedInvention && (
          <PrototypeStudioScreen
            invention={selectedInvention}
            onUpdateInvention={handleUpdateInvention}
            onOpenAssistant={handleOpenAssistant}
            onExportMarkdown={handleExportMarkdown}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'my-inventions' && (
          <MyInventionsScreen
            inventions={inventions}
            onSelectInvention={handleSelectInvention}
            onOpenPrototype={handleOpenPrototype}
            onOpenAssistant={handleOpenAssistant}
            onToggleFavorite={handleToggleFavorite}
            onDeleteInvention={handleDeleteInvention}
            onUpdateInvention={handleUpdateInvention}
            onNavigateCreate={() => navigateTo('create')}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoveryLabScreen
            inventions={inventions}
            onSelectInvention={handleSelectInvention}
            onOpenPrototype={handleOpenPrototype}
            onCompare={handleOpenComparison}
            onToggleFavorite={handleToggleFavorite}
            onUpdateInvention={handleUpdateInvention}
            initialRefineTarget={selectedInvention}
          />
        )}

        {currentScreen === 'assistant' && (
          <AssistantScreen
            selectedInvention={selectedInvention}
            inventions={inventions}
            onSelectInvention={(inv) => setSelectedInvention(inv)}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            inventionsCount={inventions.length}
            activeCount={inventions.filter((i) => (i.progressPercent || 0) > 0 && (i.progressPercent || 0) < 100).length}
            completedTasksCount={inventions.reduce((acc, i) => acc + (i.prototypeSteps?.filter((s) => s.completed)?.length || 0), 0)}
            onNavigate={navigateTo}
            onOpenAndroidCode={() => navigateTo('android-code')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            profile={profile}
            onUpdateProfile={(p) => {
              setProfile(p);
              StorageService.saveProfile(p);
            }}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            isFramed={isFramed}
            onToggleFrame={() => setIsFramed(!isFramed)}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'data-export' && (
          <DataExportScreen
            onDataWiped={handleDataWiped}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'android-code' && (
          <AndroidCodeViewerScreen onBack={handleBack} />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          savedCount={inventions.length}
        />
      )}
    </AndroidFrame>
  );
}
