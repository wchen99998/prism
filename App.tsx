import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  UploadedImage, AnalysisResponse, AspectRatio, GeneratedImage, 
  ViewPoint, Lighting, ArtStyle, FocalLength, FilmType, 
  TimeOfDay, Weather, ImageResolution, GenModel, PromptFormat,
  ShutterSpeed, ISO, Aperture, FilmGrain, CameraType, LensType, WhiteBalance, FocusStyle,
  Season, LocationType, Mood, ColorPalette, Texture, Era,
  Gender, AgeGroup, BodyType, Posture, Expression, HairStyle, HairColor,
  SkinTone, EyeColor, ClothingStyle, MakeupBase, EyeshadowStyle, EyelinerStyle,
  MascaraStyle, EyebrowStyle, BlushStyle, ContourStyle, HighlightStyle, LipStyle, NailStyle
} from './types';
import { analyzeSource, refinePrompt, generateImages } from './services/geminiService';
import { Button } from './components/Button';
import { Input, TextArea, Select, MultiSelect, Collapsible } from './components/Input';
import { Language, UiKey, translate, getOptionLabel } from './i18n';

// API Key storage key
const API_KEYS_STORAGE_KEY = 'gp_api_keys';
const ACTIVE_API_KEY_INDEX_KEY = 'gp_active_api_key_index';

interface StoredApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: number;
}

// Custom hook for localStorage persistence
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. State not saved.');
      } else {
        console.warn(`Error saving localStorage key "${key}":`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
}

const App = () => {
  // API Key Modal State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(API_KEYS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return -1;
    try {
      const stored = window.localStorage.getItem(ACTIVE_API_KEY_INDEX_KEY);
      return stored ? parseInt(stored, 10) : -1;
    } catch {
      return -1;
    }
  });
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showAddNewKey, setShowAddNewKey] = useState(false);
  const [language, setLanguage] = usePersistentState<Language>('gp_language', 'en');

  // Persist API keys to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
    } catch (error) {
      console.warn('Error saving API keys:', error);
    }
  }, [apiKeys]);

  // Persist active key index
  useEffect(() => {
    try {
      window.localStorage.setItem(ACTIVE_API_KEY_INDEX_KEY, activeKeyIndex.toString());
    } catch (error) {
      console.warn('Error saving active key index:', error);
    }
  }, [activeKeyIndex]);

  // Get current active API key
  const getActiveApiKey = (): string | null => {
    if (activeKeyIndex >= 0 && activeKeyIndex < apiKeys.length) {
      return apiKeys[activeKeyIndex].key;
    }
    return null;
  };

  const t = (key: UiKey, vars?: Record<string, string | number>) => translate(language, key, vars);
  const optionLabel = (value: string) => getOptionLabel(language, value);
  const enumOptions = <T extends Record<string, string>>(enumObj: T) =>
    Object.values(enumObj).map((value) => ({ label: optionLabel(value), value }));
  const selectPlaceholder = (item: string) => t('selectPlaceholder', { item });
  const multiSelectProps = {
    formatSelected: (count: number) => t('selectedCount', { count }),
  };

  // State - Persisted
  const [images, setImages] = usePersistentState<UploadedImage[]>('gp_images', []);
  const [sourceText, setSourceText] = usePersistentState<string>('gp_sourceText', '');
  
  // State - Ephemeral (UI/Loading)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Analysis & Prompt - Persisted
  const [analysis, setAnalysis] = usePersistentState<AnalysisResponse | null>('gp_analysis', null);
  const [currentPrompt, setCurrentPrompt] = usePersistentState<string>('gp_currentPrompt', '');
  
  // Refinement UI State - Ephemeral
  const [openSections, setOpenSections] = useState<string[]>(['camera']);

  // Refinement Inputs - Persisted
  const [customModifiers, setCustomModifiers] = usePersistentState<string>('gp_customModifiers', '');
  const [selectedViews, setSelectedViews] = usePersistentState<string[]>('gp_selectedViews', []);
  const [selectedLightings, setSelectedLightings] = usePersistentState<string[]>('gp_selectedLightings', []);
  const [selectedStyles, setSelectedStyles] = usePersistentState<string[]>('gp_selectedStyles', []);
  
  // Camera & Lens - Persisted
  const [selectedFocalLengths, setSelectedFocalLengths] = usePersistentState<string[]>('gp_selectedFocalLengths', []);
  const [selectedFilmTypes, setSelectedFilmTypes] = usePersistentState<string[]>('gp_selectedFilmTypes', []);
  const [selectedShutterSpeeds, setSelectedShutterSpeeds] = usePersistentState<string[]>('gp_selectedShutterSpeeds', []);
  const [selectedISOs, setSelectedISOs] = usePersistentState<string[]>('gp_selectedISOs', []);
  const [selectedApertures, setSelectedApertures] = usePersistentState<string[]>('gp_selectedApertures', []);
  const [selectedFilmGrains, setSelectedFilmGrains] = usePersistentState<string[]>('gp_selectedFilmGrains', []);
  const [selectedCameraTypes, setSelectedCameraTypes] = usePersistentState<string[]>('gp_selectedCameraTypes', []);
  const [selectedLensTypes, setSelectedLensTypes] = usePersistentState<string[]>('gp_selectedLensTypes', []);
  const [selectedWhiteBalances, setSelectedWhiteBalances] = usePersistentState<string[]>('gp_selectedWhiteBalances', []);
  const [selectedFocusStyles, setSelectedFocusStyles] = usePersistentState<string[]>('gp_selectedFocusStyles', []);
  
  const [selectedTimes, setSelectedTimes] = usePersistentState<string[]>('gp_selectedTimes', []);
  const [selectedWeather, setSelectedWeather] = usePersistentState<string[]>('gp_selectedWeather', []);
  const [selectedSeasons, setSelectedSeasons] = usePersistentState<string[]>('gp_selectedSeasons', []);
  const [selectedLocations, setSelectedLocations] = usePersistentState<string[]>('gp_selectedLocations', []);
  const [selectedMoods, setSelectedMoods] = usePersistentState<string[]>('gp_selectedMoods', []);
  
  // Composition & Style - Persisted
  const [selectedColorPalettes, setSelectedColorPalettes] = usePersistentState<string[]>('gp_selectedColorPalettes', []);
  const [selectedTextures, setSelectedTextures] = usePersistentState<string[]>('gp_selectedTextures', []);
  const [selectedEras, setSelectedEras] = usePersistentState<string[]>('gp_selectedEras', []);
  
  // Human Subject - Persisted
  const [selectedGenders, setSelectedGenders] = usePersistentState<string[]>('gp_selectedGenders', []);
  const [selectedAgeGroups, setSelectedAgeGroups] = usePersistentState<string[]>('gp_selectedAgeGroups', []);
  const [selectedBodyTypes, setSelectedBodyTypes] = usePersistentState<string[]>('gp_selectedBodyTypes', []);
  const [selectedPostures, setSelectedPostures] = usePersistentState<string[]>('gp_selectedPostures', []);
  const [selectedExpressions, setSelectedExpressions] = usePersistentState<string[]>('gp_selectedExpressions', []);
  const [selectedHairStyles, setSelectedHairStyles] = usePersistentState<string[]>('gp_selectedHairStyles', []);
  const [selectedHairColors, setSelectedHairColors] = usePersistentState<string[]>('gp_selectedHairColors', []);
  const [selectedSkinTones, setSelectedSkinTones] = usePersistentState<string[]>('gp_selectedSkinTones', []);
  const [selectedEyeColors, setSelectedEyeColors] = usePersistentState<string[]>('gp_selectedEyeColors', []);
  const [selectedClothingStyles, setSelectedClothingStyles] = usePersistentState<string[]>('gp_selectedClothingStyles', []);
  
  // Makeup - Persisted
  const [selectedMakeupBase, setSelectedMakeupBase] = usePersistentState<string[]>('gp_selectedMakeupBase', []);
  const [selectedEyeshadow, setSelectedEyeshadow] = usePersistentState<string[]>('gp_selectedEyeshadow', []);
  const [selectedEyeliner, setSelectedEyeliner] = usePersistentState<string[]>('gp_selectedEyeliner', []);
  const [selectedMascara, setSelectedMascara] = usePersistentState<string[]>('gp_selectedMascara', []);
  const [selectedEyebrows, setSelectedEyebrows] = usePersistentState<string[]>('gp_selectedEyebrows', []);
  const [selectedBlush, setSelectedBlush] = usePersistentState<string[]>('gp_selectedBlush', []);
  const [selectedContour, setSelectedContour] = usePersistentState<string[]>('gp_selectedContour', []);
  const [selectedHighlight, setSelectedHighlight] = usePersistentState<string[]>('gp_selectedHighlight', []);
  const [selectedLips, setSelectedLips] = usePersistentState<string[]>('gp_selectedLips', []);
  const [selectedNails, setSelectedNails] = usePersistentState<string[]>('gp_selectedNails', []);
  
  const [promptFormat, setPromptFormat] = usePersistentState<PromptFormat>('gp_promptFormat', PromptFormat.NATURAL);
  
  // Generation Config - Persisted
  const [aspectRatio, setAspectRatio] = usePersistentState<AspectRatio>('gp_aspectRatio', AspectRatio.SQUARE);
  const [resolution, setResolution] = usePersistentState<ImageResolution>('gp_resolution', ImageResolution.RES_1K);
  const [selectedModel, setSelectedModel] = usePersistentState<GenModel>('gp_selectedModel', GenModel.NANO_BANANA);
  const [imageCount, setImageCount] = usePersistentState<number>('gp_imageCount', 1);
  
  // Output - Persisted
  const [generatedImages, setGeneratedImages] = usePersistentState<GeneratedImage[]>('gp_generatedImages', []);
  const [selectedReferenceIds, setSelectedReferenceIds] = usePersistentState<string[]>('gp_selectedReferenceIds', []);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseDataUrl = (url: string): { data: string; mimeType: string } | null => {
    const match = url.match(/^data:(.+);base64,(.*)$/);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
  };

  const referenceCandidates = useMemo(() => {
    const uploads = images.map((img) => ({
      id: `upload-${img.id}`,
      source: 'upload' as const,
      data: img.data,
      mimeType: img.mimeType,
      previewUrl: `data:${img.mimeType};base64,${img.data}`,
    }));

    const generated = generatedImages.flatMap((img) => {
      const parsed = parseDataUrl(img.url);
      if (!parsed) return [];
      return [{
        id: `generated-${img.id}`,
        source: 'generated' as const,
        data: parsed.data,
        mimeType: parsed.mimeType,
        previewUrl: img.url,
      }];
    });

    return [...uploads, ...generated];
  }, [images, generatedImages]);

  const selectedReferenceImages = useMemo(
    () =>
      referenceCandidates
        .filter((item) => selectedReferenceIds.includes(item.id))
        .map((item) => ({ id: item.id, data: item.data, mimeType: item.mimeType })),
    [referenceCandidates, selectedReferenceIds]
  );

  useEffect(() => {
    if (selectedReferenceIds.length === 0) return;
    const available = new Set(referenceCandidates.map((item) => item.id));
    setSelectedReferenceIds((prev) => {
      const next = prev.filter((id) => available.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [referenceCandidates, selectedReferenceIds.length, setSelectedReferenceIds]);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: UploadedImage[] = [];
      const files = e.target.files;
      const fileCount = files.length;
      
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64 = event.target.result as string;
            const base64Data = base64.split(',')[1];
            newImages.push({
              id: Math.random().toString(36).substr(2, 9),
              data: base64Data,
              mimeType: file.type,
            });
            if (newImages.length === fileCount) {
              setImages((prev) => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleApiKeySelect = () => {
    setShowApiKeyModal(true);
    setShowAddNewKey(apiKeys.length === 0);
    setNewKeyName('');
    setNewKeyValue('');
  };

  const handleAddNewKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    const newKey: StoredApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName.trim(),
      key: newKeyValue.trim(),
      createdAt: Date.now(),
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setActiveKeyIndex(apiKeys.length); // Select the newly added key
    setNewKeyName('');
    setNewKeyValue('');
    setShowAddNewKey(false);
  };

  const handleSelectKey = (index: number) => {
    setActiveKeyIndex(index);
  };

  const handleDeleteKey = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newKeys = apiKeys.filter((_, i) => i !== index);
    setApiKeys(newKeys);
    if (activeKeyIndex === index) {
      setActiveKeyIndex(newKeys.length > 0 ? 0 : -1);
    } else if (activeKeyIndex > index) {
      setActiveKeyIndex(activeKeyIndex - 1);
    }
  };

  const handleCloseModal = () => {
    setShowApiKeyModal(false);
    setShowAddNewKey(false);
    setNewKeyName('');
    setNewKeyValue('');
  };

  // Step 1: Analyze
  const handleAnalyze = async () => {
    if (images.length === 0 && !sourceText.trim()) return;
    
    const apiKey = getActiveApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      setShowAddNewKey(true);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeSource(images, sourceText, apiKey);
      setAnalysis(result);
      setCurrentPrompt(result.suggestedPrompt);
      setOpenSections(['camera']); 
    } catch (error) {
      console.error(error);
      alert(t('alertAnalyzeFail'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2: Refine
  const handleRefine = async () => {
    if (!currentPrompt) return;
    
    const apiKey = getActiveApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      setShowAddNewKey(true);
      return;
    }
    
    setIsRefining(true);
    try {
      const modifiers = [
        customModifiers ? `Custom Details: ${customModifiers}` : '',
        // Composition & Style modifiers
        selectedViews.length ? `Perspective: ${selectedViews.join(', ')}` : '',
        selectedStyles.length ? `Art Style: ${selectedStyles.join(', ')}` : '',
        selectedColorPalettes.length ? `Color Palette: ${selectedColorPalettes.join(', ')}` : '',
        selectedTextures.length ? `Texture: ${selectedTextures.join(', ')}` : '',
        selectedEras.length ? `Time Period/Era: ${selectedEras.join(', ')}` : '',
        // Camera & Lens modifiers
        selectedCameraTypes.length ? `Camera: ${selectedCameraTypes.join(', ')}` : '',
        selectedLensTypes.length ? `Lens Type: ${selectedLensTypes.join(', ')}` : '',
        selectedFocalLengths.length ? `Focal Length: ${selectedFocalLengths.join(', ')}` : '',
        selectedApertures.length ? `Aperture: ${selectedApertures.join(', ')}` : '',
        selectedShutterSpeeds.length ? `Shutter Speed: ${selectedShutterSpeeds.join(', ')}` : '',
        selectedISOs.length ? `ISO: ${selectedISOs.join(', ')}` : '',
        selectedFilmTypes.length ? `Film Stock: ${selectedFilmTypes.join(', ')}` : '',
        selectedFilmGrains.length ? `Film Grain: ${selectedFilmGrains.join(', ')}` : '',
        selectedWhiteBalances.length ? `White Balance: ${selectedWhiteBalances.join(', ')}` : '',
        selectedFocusStyles.length ? `Focus/DOF: ${selectedFocusStyles.join(', ')}` : '',
        // Environment & Lighting modifiers
        selectedTimes.length ? `Time of Day: ${selectedTimes.join(', ')}` : '',
        selectedWeather.length ? `Weather: ${selectedWeather.join(', ')}` : '',
        selectedSeasons.length ? `Season: ${selectedSeasons.join(', ')}` : '',
        selectedLocations.length ? `Location/Setting: ${selectedLocations.join(', ')}` : '',
        selectedMoods.length ? `Mood/Atmosphere: ${selectedMoods.join(', ')}` : '',
        selectedLightings.length ? `Lighting: ${selectedLightings.join(', ')}` : '',
        // Human Subject modifiers
        selectedGenders.length ? `Gender presentation: ${selectedGenders.join(', ')}` : '',
        selectedAgeGroups.length ? `Age: ${selectedAgeGroups.join(', ')}` : '',
        selectedBodyTypes.length ? `Body type: ${selectedBodyTypes.join(', ')}` : '',
        selectedPostures.length ? `Posture: ${selectedPostures.join(', ')}` : '',
        selectedExpressions.length ? `Expression: ${selectedExpressions.join(', ')}` : '',
        selectedHairStyles.length ? `Hair style: ${selectedHairStyles.join(', ')}` : '',
        selectedHairColors.length ? `Hair color: ${selectedHairColors.join(', ')}` : '',
        selectedSkinTones.length ? `Skin tone: ${selectedSkinTones.join(', ')}` : '',
        selectedEyeColors.length ? `Eye color: ${selectedEyeColors.join(', ')}` : '',
        selectedClothingStyles.length ? `Clothing: ${selectedClothingStyles.join(', ')}` : '',
        // Makeup modifiers
        selectedMakeupBase.length ? `Base makeup: ${selectedMakeupBase.join(', ')}` : '',
        selectedEyeshadow.length ? `Eyeshadow: ${selectedEyeshadow.join(', ')}` : '',
        selectedEyeliner.length ? `Eyeliner: ${selectedEyeliner.join(', ')}` : '',
        selectedMascara.length ? `Mascara/Lashes: ${selectedMascara.join(', ')}` : '',
        selectedEyebrows.length ? `Eyebrows: ${selectedEyebrows.join(', ')}` : '',
        selectedBlush.length ? `Blush: ${selectedBlush.join(', ')}` : '',
        selectedContour.length ? `Contour: ${selectedContour.join(', ')}` : '',
        selectedHighlight.length ? `Highlight: ${selectedHighlight.join(', ')}` : '',
        selectedLips.length ? `Lips: ${selectedLips.join(', ')}` : '',
        selectedNails.length ? `Nails: ${selectedNails.join(', ')}` : '',
      ].filter(Boolean).join('. ');
      
      const newPrompt = await refinePrompt(currentPrompt, modifiers, images, promptFormat, apiKey);
      setCurrentPrompt(newPrompt);
    } catch (error) {
      console.error(error);
      alert(t('alertRefineFail'));
    } finally {
      setIsRefining(false);
    }
  };

  // Step 3: Generate
  const handleGenerate = async () => {
    if (!currentPrompt) return;
    
    const apiKey = getActiveApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      setShowAddNewKey(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const referenceImages = selectedReferenceImages.length > 0 ? selectedReferenceImages : null;
      const urls = await generateImages(
        currentPrompt, 
        aspectRatio, 
        selectedModel,
        resolution,
        referenceImages,
        imageCount,
        apiKey
      );
      
      const newGeneratedImages = urls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url: url,
        prompt: currentPrompt,
        model: selectedModel
      }));
      
      setGeneratedImages(prev => [...newGeneratedImages, ...prev]);
    } catch (error) {
      console.error(error);
      alert(t('alertGenerateFail'));
    } finally {
      setIsGenerating(false);
    }
  };

  const clearImages = () => {
    setImages([]);
  };

  const clearAll = () => {
      if(window.confirm(t('confirmClearAll'))) {
        setImages([]);
        setSourceText('');
        setAnalysis(null);
        setCurrentPrompt('');
        setCustomModifiers('');
        setSelectedViews([]);
        setSelectedLightings([]);
        setSelectedStyles([]);
        setSelectedFocalLengths([]);
        setSelectedFilmTypes([]);
        setSelectedTimes([]);
        setSelectedWeather([]);
        setPromptFormat(PromptFormat.NATURAL);
        setGeneratedImages([]);
        setSelectedReferenceIds([]);
        localStorage.clear();
      }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  return (
    <div className="h-screen bg-white text-gray-900 font-sans selection:bg-accent selection:text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT PANE: CONTROLS */}
      <div className="w-full md:w-1/2 h-full flex flex-col border-r-2 border-gray-100 overflow-y-auto">
        <header className="p-6 border-b-2 border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent"></div>
            <h1 className="text-xl font-bold tracking-tight">GEMINI PRISM</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleApiKeySelect} className={`text-xs font-mono uppercase transition-colors flex items-center gap-1 ${getActiveApiKey() ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}>
               {getActiveApiKey() ? t('apiKeySet') : t('apiKeyMissing')}
             </button>
             <div className="h-4 w-px bg-gray-200"></div>
             <div className="flex items-center gap-1 text-xs font-mono uppercase">
               <button
                 onClick={() => setLanguage('en')}
                 className={`transition-colors ${language === 'en' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                 aria-label="Switch to English"
               >
                 EN
               </button>
               <span className="text-gray-300">/</span>
               <button
                 onClick={() => setLanguage('zh-CN')}
                 className={`transition-colors ${language === 'zh-CN' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                 aria-label="切换到中文"
               >
                 中文
               </button>
             </div>
             <div className="h-4 w-px bg-gray-200"></div>
             <button onClick={clearAll} className="text-xs font-mono text-gray-400 hover:text-red-500 uppercase transition-colors">{t('resetAll')}</button>
             <span className="text-xs font-mono text-gray-400">V1.1.0</span>
          </div>
        </header>

        <div className="p-8 space-y-12">
          
          {/* SECTION 1: SOURCE MATERIAL */}
          <section className="space-y-6">
            <div className="flex justify-between items-baseline">
              <h2 className="text-lg font-bold uppercase">{t('sourceMaterial')}</h2>
              {images.length > 0 && (
                <button onClick={clearImages} className="text-xs text-red-500 hover:text-red-600 font-bold uppercase underline decoration-2">
                  {t('clearImages')}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <TextArea 
                placeholder={t('sourcePlaceholder')}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[100px]"
              />

              <div className="grid grid-cols-4 gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 hover:border-accent hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center transition-colors group"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                  />
                  <span className="text-2xl text-gray-300 group-hover:text-accent">+</span>
                </div>

                {images.map((img) => (
                  <div key={img.id} className="aspect-square bg-gray-100 relative overflow-hidden border-2 border-gray-100">
                    <img 
                      src={`data:${img.mimeType};base64,${img.data}`} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover transition-all duration-500" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={images.length === 0 && !sourceText.trim()} 
              isLoading={isAnalyzing}
              className="w-full"
            >
              {t('analyzeSource')}
            </Button>
          </section>

          {/* SECTION 2: ANALYSIS & REFINEMENT */}
          {analysis && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-t-2 border-gray-100 pt-8">
                 <h2 className="text-lg font-bold uppercase mb-4">{t('deconstruction')}</h2>
                 <div className="bg-gray-50 p-4 border-l-4 border-accent text-sm leading-relaxed text-gray-600">
                    <p className="font-bold text-black mb-1">{t('observation')}</p>
                    {analysis.description}
                 </div>
                 <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="border-2 border-gray-100 p-2">
                      <span className="block font-bold text-gray-400 uppercase">{t('subject')}</span>
                      {analysis.subject}
                    </div>
                    <div className="border-2 border-gray-100 p-2">
                      <span className="block font-bold text-gray-400 uppercase">{t('composition')}</span>
                      {analysis.composition}
                    </div>
                 </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-8 space-y-4">
                <h2 className="text-lg font-bold uppercase mb-4">{t('refinement')}</h2>
                
                <TextArea 
                  label={t('currentPrompt')} 
                  value={currentPrompt} 
                  onChange={(e) => setCurrentPrompt(e.target.value)} 
                  className="mb-4 min-h-[300px] text-base leading-relaxed"
                />

                <div className="flex flex-col">
                  <Collapsible 
                    title={t('cameraLens')} 
                    isOpen={openSections.includes('camera')} 
                    onToggle={() => toggleSection('camera')}
                    count={selectedCameraTypes.length + selectedLensTypes.length + selectedFocalLengths.length + selectedApertures.length + selectedShutterSpeeds.length + selectedISOs.length + selectedFilmTypes.length + selectedFilmGrains.length + selectedWhiteBalances.length + selectedFocusStyles.length}
                  >
                    <div className="space-y-4">
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('cameraType')}
                        options={enumOptions(CameraType)}
                        value={selectedCameraTypes}
                        onChange={setSelectedCameraTypes}
                        placeholder={selectPlaceholder(t('cameraType'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('lensType')}
                        options={enumOptions(LensType)}
                        value={selectedLensTypes}
                        onChange={setSelectedLensTypes}
                        placeholder={selectPlaceholder(t('lensType'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('focalLength')}
                        options={enumOptions(FocalLength)}
                        value={selectedFocalLengths}
                        onChange={setSelectedFocalLengths}
                        placeholder={selectPlaceholder(t('focalLength'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('aperture')}
                        options={enumOptions(Aperture)}
                        value={selectedApertures}
                        onChange={setSelectedApertures}
                        placeholder={selectPlaceholder(t('aperture'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('shutterSpeed')}
                        options={enumOptions(ShutterSpeed)}
                        value={selectedShutterSpeeds}
                        onChange={setSelectedShutterSpeeds}
                        placeholder={selectPlaceholder(t('shutterSpeed'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('iso')}
                        options={enumOptions(ISO)}
                        value={selectedISOs}
                        onChange={setSelectedISOs}
                        placeholder={selectPlaceholder(t('iso'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('filmStock')}
                        options={enumOptions(FilmType)}
                        value={selectedFilmTypes}
                        onChange={setSelectedFilmTypes}
                        placeholder={selectPlaceholder(t('filmStock'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('filmGrain')}
                        options={enumOptions(FilmGrain)}
                        value={selectedFilmGrains}
                        onChange={setSelectedFilmGrains}
                        placeholder={selectPlaceholder(t('filmGrain'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('whiteBalance')}
                        options={enumOptions(WhiteBalance)}
                        value={selectedWhiteBalances}
                        onChange={setSelectedWhiteBalances}
                        placeholder={selectPlaceholder(t('whiteBalance'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('focusDepth')}
                        options={enumOptions(FocusStyle)}
                        value={selectedFocusStyles}
                        onChange={setSelectedFocusStyles}
                        placeholder={selectPlaceholder(t('focusDepth'))}
                      />
                    </div>
                  </Collapsible>

                  <Collapsible 
                    title={t('environmentLighting')} 
                    isOpen={openSections.includes('environment')} 
                    onToggle={() => toggleSection('environment')}
                    count={selectedTimes.length + selectedWeather.length + selectedSeasons.length + selectedLocations.length + selectedMoods.length + selectedLightings.length}
                  >
                    <div className="space-y-4">
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('timeOfDay')}
                        options={enumOptions(TimeOfDay)}
                        value={selectedTimes}
                        onChange={setSelectedTimes}
                        placeholder={selectPlaceholder(t('timeOfDay'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('season')}
                        options={enumOptions(Season)}
                        value={selectedSeasons}
                        onChange={setSelectedSeasons}
                        placeholder={selectPlaceholder(t('season'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('weather')}
                        options={enumOptions(Weather)}
                        value={selectedWeather}
                        onChange={setSelectedWeather}
                        placeholder={selectPlaceholder(t('weather'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('location')}
                        options={enumOptions(LocationType)}
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                        placeholder={selectPlaceholder(t('location'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('mood')}
                        options={enumOptions(Mood)}
                        value={selectedMoods}
                        onChange={setSelectedMoods}
                        placeholder={selectPlaceholder(t('mood'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('lightingStyle')}
                        options={enumOptions(Lighting)}
                        value={selectedLightings}
                        onChange={setSelectedLightings}
                        placeholder={selectPlaceholder(t('lightingStyle'))}
                      />
                    </div>
                  </Collapsible>

                  <Collapsible 
                    title={t('compositionStyle')} 
                    isOpen={openSections.includes('composition')} 
                    onToggle={() => toggleSection('composition')}
                    count={selectedViews.length + selectedStyles.length + selectedColorPalettes.length + selectedTextures.length + selectedEras.length}
                  >
                     <div className="space-y-4">
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('perspective')}
                        options={enumOptions(ViewPoint)}
                        value={selectedViews}
                        onChange={setSelectedViews}
                        placeholder={selectPlaceholder(t('perspective'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('artStyle')}
                        options={enumOptions(ArtStyle)}
                        value={selectedStyles}
                        onChange={setSelectedStyles}
                        placeholder={selectPlaceholder(t('artStyle'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('colorPalette')}
                        options={enumOptions(ColorPalette)}
                        value={selectedColorPalettes}
                        onChange={setSelectedColorPalettes}
                        placeholder={selectPlaceholder(t('colorPalette'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('texture')}
                        options={enumOptions(Texture)}
                        value={selectedTextures}
                        onChange={setSelectedTextures}
                        placeholder={selectPlaceholder(t('texture'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('era')}
                        options={enumOptions(Era)}
                        value={selectedEras}
                        onChange={setSelectedEras}
                        placeholder={selectPlaceholder(t('era'))}
                      />
                    </div>
                  </Collapsible>

                  <Collapsible 
                    title={t('humanSubject')} 
                    isOpen={openSections.includes('human')} 
                    onToggle={() => toggleSection('human')}
                    count={selectedGenders.length + selectedAgeGroups.length + selectedBodyTypes.length + selectedPostures.length + selectedExpressions.length + selectedHairStyles.length + selectedHairColors.length + selectedSkinTones.length + selectedEyeColors.length + selectedClothingStyles.length}
                  >
                    <div className="space-y-4">
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('genderPresentation')}
                        options={enumOptions(Gender)}
                        value={selectedGenders}
                        onChange={setSelectedGenders}
                        placeholder={selectPlaceholder(t('genderPresentation'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('ageGroup')}
                        options={enumOptions(AgeGroup)}
                        value={selectedAgeGroups}
                        onChange={setSelectedAgeGroups}
                        placeholder={selectPlaceholder(t('ageGroup'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('bodyType')}
                        options={enumOptions(BodyType)}
                        value={selectedBodyTypes}
                        onChange={setSelectedBodyTypes}
                        placeholder={selectPlaceholder(t('bodyType'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('posturePose')}
                        options={enumOptions(Posture)}
                        value={selectedPostures}
                        onChange={setSelectedPostures}
                        placeholder={selectPlaceholder(t('posturePose'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('facialExpression')}
                        options={enumOptions(Expression)}
                        value={selectedExpressions}
                        onChange={setSelectedExpressions}
                        placeholder={selectPlaceholder(t('facialExpression'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('hairStyle')}
                        options={enumOptions(HairStyle)}
                        value={selectedHairStyles}
                        onChange={setSelectedHairStyles}
                        placeholder={selectPlaceholder(t('hairStyle'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('hairColor')}
                        options={enumOptions(HairColor)}
                        value={selectedHairColors}
                        onChange={setSelectedHairColors}
                        placeholder={selectPlaceholder(t('hairColor'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('skinTone')}
                        options={enumOptions(SkinTone)}
                        value={selectedSkinTones}
                        onChange={setSelectedSkinTones}
                        placeholder={selectPlaceholder(t('skinTone'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('eyeColor')}
                        options={enumOptions(EyeColor)}
                        value={selectedEyeColors}
                        onChange={setSelectedEyeColors}
                        placeholder={selectPlaceholder(t('eyeColor'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('clothingStyle')}
                        options={enumOptions(ClothingStyle)}
                        value={selectedClothingStyles}
                        onChange={setSelectedClothingStyles}
                        placeholder={selectPlaceholder(t('clothingStyle'))}
                      />
                    </div>
                  </Collapsible>

                  <Collapsible 
                    title={t('makeupBeauty')} 
                    isOpen={openSections.includes('makeup')} 
                    onToggle={() => toggleSection('makeup')}
                    count={selectedMakeupBase.length + selectedEyeshadow.length + selectedEyeliner.length + selectedMascara.length + selectedEyebrows.length + selectedBlush.length + selectedContour.length + selectedHighlight.length + selectedLips.length + selectedNails.length}
                  >
                    <div className="space-y-4">
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('baseFoundation')}
                        options={enumOptions(MakeupBase)}
                        value={selectedMakeupBase}
                        onChange={setSelectedMakeupBase}
                        placeholder={selectPlaceholder(t('baseFoundation'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('eyeshadow')}
                        options={enumOptions(EyeshadowStyle)}
                        value={selectedEyeshadow}
                        onChange={setSelectedEyeshadow}
                        placeholder={selectPlaceholder(t('eyeshadow'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('eyeliner')}
                        options={enumOptions(EyelinerStyle)}
                        value={selectedEyeliner}
                        onChange={setSelectedEyeliner}
                        placeholder={selectPlaceholder(t('eyeliner'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('mascara')}
                        options={enumOptions(MascaraStyle)}
                        value={selectedMascara}
                        onChange={setSelectedMascara}
                        placeholder={selectPlaceholder(t('mascara'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('eyebrows')}
                        options={enumOptions(EyebrowStyle)}
                        value={selectedEyebrows}
                        onChange={setSelectedEyebrows}
                        placeholder={selectPlaceholder(t('eyebrows'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('blush')}
                        options={enumOptions(BlushStyle)}
                        value={selectedBlush}
                        onChange={setSelectedBlush}
                        placeholder={selectPlaceholder(t('blush'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('contour')}
                        options={enumOptions(ContourStyle)}
                        value={selectedContour}
                        onChange={setSelectedContour}
                        placeholder={selectPlaceholder(t('contour'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('highlight')}
                        options={enumOptions(HighlightStyle)}
                        value={selectedHighlight}
                        onChange={setSelectedHighlight}
                        placeholder={selectPlaceholder(t('highlight'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('lips')}
                        options={enumOptions(LipStyle)}
                        value={selectedLips}
                        onChange={setSelectedLips}
                        placeholder={selectPlaceholder(t('lips'))}
                      />
                      <MultiSelect 
                        {...multiSelectProps}
                        label={t('nails')}
                        options={enumOptions(NailStyle)}
                        value={selectedNails}
                        onChange={setSelectedNails}
                        placeholder={selectPlaceholder(t('nails'))}
                      />
                    </div>
                  </Collapsible>
                  
                  <Collapsible 
                    title={t('outputFormat')} 
                    isOpen={openSections.includes('format')} 
                    onToggle={() => toggleSection('format')}
                    count={promptFormat !== PromptFormat.NATURAL ? 1 : 0}
                  >
                    <Select 
                      options={enumOptions(PromptFormat)}
                      value={promptFormat}
                      onChange={(e) => setPromptFormat(e.target.value as PromptFormat)}
                    />
                  </Collapsible>

                  <Collapsible 
                    title={t('customDetails')} 
                    isOpen={openSections.includes('custom')} 
                    onToggle={() => toggleSection('custom')}
                    count={customModifiers ? 1 : 0}
                  >
                    <Input 
                      placeholder={t('customDetailsPlaceholder')}
                      value={customModifiers}
                      onChange={(e) => setCustomModifiers(e.target.value)}
                    />
                  </Collapsible>
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={handleRefine} isLoading={isRefining} className="w-full">
                    {t('refinePrompt')}
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: GENERATION */}
          {currentPrompt && (
            <section className="space-y-4 border-t-2 border-gray-100 pt-8 pb-20">
               <h2 className="text-lg font-bold uppercase">{t('synthesis')}</h2>
               
               <div className="flex flex-col gap-4">
                 <Select 
                    label={t('model')}
                    options={[
                      { label: t('modelStandard'), value: GenModel.NANO_BANANA },
                      { label: t('modelPro'), value: GenModel.NANO_BANANA_PRO }
                    ]}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as GenModel)}
                  />

                 <div className="grid grid-cols-1 gap-4">
                   <Select 
                      label={t('aspectRatio')}
                      options={enumOptions(AspectRatio)}
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    />
                    
                    {/* Resolution only for Pro Model */}
                    {selectedModel === GenModel.NANO_BANANA_PRO ? (
                       <Select 
                        label={t('resolution')}
                        options={enumOptions(ImageResolution)}
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value as ImageResolution)}
                      />
                    ) : (
                      <div className="flex flex-col gap-1 w-full opacity-50 pointer-events-none">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('resolution')}</label>
                         <div className="border-2 border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                           {t('resolutionStandard')}
                         </div>
                      </div>
                    )}
                 </div>

                <div className="grid grid-cols-2 gap-4">
                   <Select 
                      label={t('imageCount')}
                      options={[1, 2, 3, 4].map(n => ({ label: n.toString(), value: n.toString() }))}
                      value={imageCount}
                      onChange={(e) => setImageCount(parseInt(e.target.value))}
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('source')}</label>
                     <span className="text-[10px] font-mono uppercase text-gray-400">
                       {t('selectedCount', { count: selectedReferenceIds.length })}
                     </span>
                   </div>
                   <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                     {referenceCandidates.length === 0 ? (
                       <div className="h-20 w-full min-w-[180px] border-2 border-dashed border-gray-200 text-xs text-gray-400 flex items-center justify-center">
                         {t('includeSources')}
                       </div>
                     ) : (
                       referenceCandidates.map((item) => {
                         const isSelected = selectedReferenceIds.includes(item.id);
                         return (
                           <button
                             key={item.id}
                             type="button"
                             onClick={() =>
                               setSelectedReferenceIds((prev) =>
                                 prev.includes(item.id)
                                   ? prev.filter((id) => id !== item.id)
                                   : [...prev, item.id]
                               )
                             }
                             aria-pressed={isSelected}
                             className={`relative h-20 w-20 flex-shrink-0 border-2 overflow-hidden transition-all ${
                               isSelected
                                 ? 'border-accent ring-2 ring-accent/30'
                                 : 'border-gray-200 hover:border-gray-300'
                             }`}
                           >
                             <img
                               src={item.previewUrl}
                               alt={item.source === 'upload' ? 'Uploaded reference' : 'Generated reference'}
                               className="h-full w-full object-cover"
                             />
                             <div
                               className={`absolute top-1 left-1 h-3 w-3 rounded-full border ${
                                 isSelected ? 'bg-accent border-accent' : 'bg-white/80 border-gray-300'
                               }`}
                             />
                             <div className="absolute bottom-1 right-1 text-[9px] font-mono uppercase text-white bg-black/60 px-1">
                               {item.source === 'upload' ? 'IN' : 'GEN'}
                             </div>
                           </button>
                         );
                       })
                     )}
                   </div>
                 </div>
               </div>

               <Button variant="secondary" onClick={handleGenerate} isLoading={isGenerating} className="w-full py-4 text-lg">
                 {t('generateImages', { count: imageCount, plural: imageCount > 1 ? 'S' : '' })}
               </Button>
            </section>
          )}
        </div>
      </div>

      {/* RIGHT PANE: GALLERY */}
      <div className="w-full md:w-1/2 bg-gray-50 h-full overflow-y-auto relative">
        <div className="p-8 min-h-full flex flex-col items-center">
          
          {generatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto text-gray-300 space-y-4">
               <div className="w-24 h-24 border-4 border-gray-200 border-dashed flex items-center justify-center">
                 <div className="w-4 h-4 bg-gray-200"></div>
               </div>
               <p className="font-mono text-sm uppercase tracking-widest">{t('waitingForOutput')}</p>
            </div>
          ) : (
            <div className="w-full space-y-8 pb-10">
              {generatedImages.map((img, idx) => (
                <div key={img.id} className="animate-in zoom-in-95 duration-500 w-full group">
                   <div className="flex justify-between items-end mb-2">
                      <span className="font-mono text-xs text-gray-400">
                        #{generatedImages.length - idx} // {img.model === GenModel.NANO_BANANA ? 'NANO BANANA' : 'NANO BANANA PRO'}
                      </span>
                      <a 
                        href={img.url} 
                        download={`gemini-gen-${img.id}.jpg`}
                        className="text-xs font-bold uppercase hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {t('downloadOriginal')}
                      </a>
                   </div>
                   <div className="bg-white p-2 border-2 border-gray-200 shadow-sm">
                      <img src={img.url} alt={t('generatedAlt')} className="w-full h-auto block" />
                   </div>
                   <p className="mt-3 text-xs text-gray-500 font-mono border-l-2 border-gray-200 pl-3 line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                     {img.prompt}
                   </p>
                </div>
              ))}
            </div>
          )}

          {/* Loading Overlay for Right Pane */}
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
               <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-16 border-4 border-gray-200 border-t-accent animate-spin rounded-none"></div>
                 <span className="font-bold uppercase tracking-widest text-sm animate-pulse">{t('renderingFrames', { count: imageCount, plural: imageCount > 1 ? 's' : '' })}</span>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md border-2 border-gray-200 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-tight">{t('manageApiKeys')}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Existing Keys List */}
              {apiKeys.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('selectApiKey')}</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {apiKeys.map((key, index) => (
                      <div 
                        key={key.id}
                        onClick={() => handleSelectKey(index)}
                        className={`p-3 border-2 cursor-pointer flex justify-between items-center transition-colors ${
                          activeKeyIndex === index 
                            ? 'border-accent bg-accent/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 border ${activeKeyIndex === index ? 'bg-accent border-accent' : 'border-gray-400'}`} />
                          <div>
                            <p className="font-medium text-sm">{key.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{key.key.slice(0, 8)}...{key.key.slice(-4)}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteKey(index, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title={t('deleteKey')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Key Section */}
              {showAddNewKey ? (
                <div className="space-y-4 border-t-2 border-gray-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('addNewApiKey')}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">{t('keyName')}</label>
                      <input
                        type="text"
                        placeholder={t('keyNamePlaceholder')}
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full border-2 border-gray-200 p-2 text-sm focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">{t('apiKeyLabel')}</label>
                      <input
                        type="password"
                        placeholder={t('apiKeyPlaceholder')}
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        className="w-full border-2 border-gray-200 p-2 text-sm focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewKey}
                        disabled={!newKeyName.trim() || !newKeyValue.trim()}
                        className="flex-1 bg-accent text-white py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('addKey')}
                      </button>
                      {apiKeys.length > 0 && (
                        <button
                          onClick={() => setShowAddNewKey(false)}
                          className="px-4 py-2 border-2 border-gray-200 text-sm font-bold uppercase tracking-wider hover:border-gray-300 transition-colors"
                        >
                          {t('cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddNewKey(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-accent hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('addNewApiKey')}
                </button>
              )}

              {/* Info */}
              <div className="bg-gray-50 p-3 border-l-4 border-gray-300 text-xs text-gray-600">
                <p className="font-bold text-gray-700 mb-1">{t('aboutApiKeys')}</p>
                <p>{t('apiKeysInfo')}<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent underline">{t('googleAiStudio')}</a>.</p>
              </div>
            </div>

            <div className="p-4 border-t-2 border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
