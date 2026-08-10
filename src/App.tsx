import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CardPreview } from './components/CardPreview';
import { BuilderDetails, BuilderRole, PhotoTransform, CARD_THEMES } from './types';
import { generateTagline, generateCardNumber } from './lib/builderTitles';
import { processUploadedFile } from './lib/imageProcessing';
import { exportCardAsPng, shareOnX, handleFullShareFlow } from './lib/share';
import { 
  Upload, RefreshCw, User, Code, Briefcase, 
  Palette, Download, Share2, Check, AlertCircle, Sliders, Sparkles,
  ArrowRight, PlusCircle
} from 'lucide-react';

const ROLES: BuilderRole[] = [
  'Developer',
  'Full Stack',
  'Backend',
  'Frontend',
  'AI / ML',
  'Designer',
  'Founder',
  'Student',
  'Engineer',
  'Builder',
  'Security',
  'Product',
];

export default function App() {


  // User generator state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    filter: 'none',
  });

  const [name, setName] = useState<string>('');
  const [stack, setStack] = useState<string>('');
  const [role, setRole] = useState<BuilderRole>('Developer');
  const [themeId, setThemeId] = useState<string>(CARD_THEMES[0].id);
  const [titleVariant, setTitleVariant] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState<string>(generateCardNumber());
  const [passType, setPassType] = useState<'single' | 'team'>('single');

  // Teammates state (supports up to 2 teammates, making a team of 3)
  interface TeammateFormState {
    name: string;
    role: BuilderRole;
    photoUrl: string | null;
    transform: PhotoTransform;
    showAdjustments: boolean;
  }

  const initialTeammateState = (): TeammateFormState => ({
    name: '',
    role: 'Developer',
    photoUrl: null,
    transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'none' as const },
    showAdjustments: false
  });

  const [teammates, setTeammates] = useState<TeammateFormState[]>([initialTeammateState()]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState<{
    title: string;
    message: string;
    clipboardSuccess?: boolean;
  } | null>(null);

  useEffect(() => {
    setCardNumber(generateCardNumber());
  }, []);

  const builderTitle = generateTagline(role, stack, titleVariant);

  const builderDetails: BuilderDetails = {
    id: cardNumber,
    name: name || 'HARSH RAIKWAR',
    stack: stack || 'Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow',
    role: role || 'AI / ML',
    builderTitle: builderTitle || '"Neural Network Hacker & Prompt Sorcerer"',
    cardNumber: cardNumber || 'HH26-4E90D7AC',
    photoUrl: photoUrl || '',
    photoTransform: transform,
    themeId: themeId,
    createdAt: new Date().toISOString(),
    passType,
    teammates: passType === 'team'
      ? teammates
          .filter(t => t.name.trim().length > 0 || t.photoUrl) // Include teammates with a name or photo
          .map(t => ({
            name: t.name || 'TEAMMATE',
            role: t.role || 'Builder',
            photoUrl: t.photoUrl || '',
            photoTransform: t.transform
          }))
      : undefined
  };



  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await processUploadedFile(file);
      setPhotoUrl(result.dataUrl);
      setTransform({
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: 'none',
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage('Could not process photo. Please select a valid JPG or PNG image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (detailsToExport = builderDetails) => {
    setIsDownloading(true);
    try {
      await exportCardAsPng(detailsToExport);
    } catch (err) {
      console.error('Failed to export:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (detailsToShare = builderDetails) => {
    setIsSharing(true);
    try {
      const res = await handleFullShareFlow(detailsToShare);
      if (res.nativeShared) {
        setShareNotice({
          title: 'Pass Shared Successfully! 🌴',
          message: 'Your Builder Pass and caption were shared via your device share sheet.',
        });
      } else if (res.twitterOpened) {
        setShareNotice({
          title: 'Opening X with #FrameInGoa! 🐦',
          message: 'X was opened with your pre-filled caption. Please download the PNG below and upload it to attach it to your post!',
        });
      }
    } catch (err) {
      console.error('Share error:', err);
      shareOnX(detailsToShare);
    } finally {
      setIsSharing(false);
    }
  };

  const handleReset = () => {
    setPhotoUrl(null);
    setTransform({ zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'none' });
    setName('Harsh Raikwar');
    setStack('Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow');
    setRole('AI / ML');
    setTitleVariant(0);
    setCardNumber(generateCardNumber());
    setPassType('single');
    setTeammates([initialTeammateState()]);
  };

  return (
    <div className="min-h-screen bg-[#070d0a] text-[#f2efe9] font-sans antialiased flex flex-col justify-between selection:bg-[#facc15] selection:text-black">
      {/* Navbar */}
      <Navbar onReset={handleReset} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

            {/* Simple Human Title Intro */}
            <div className="space-y-2 border-b border-emerald-900/60 pb-6">
              <h1 className="font-space font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Builder Passport Generator
              </h1>
              <p className="font-sans text-sm text-emerald-300/80 max-w-2xl leading-relaxed">
                Create your official Hacker House Goa 2026 builder card. Customize your photo, role, tech stack, and details to share with the community.
              </p>
            </div>

        {/* 2-Column Human Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Format Selector */}
            <div className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-4 flex items-center justify-between gap-4">
              <span className="font-space font-bold text-sm text-white">Pass Type</span>
              <div className="flex bg-[#080d0b] border border-emerald-950 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPassType('single')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-space font-extrabold transition-all cursor-pointer ${
                    passType === 'single'
                      ? 'bg-[#facc15] text-black shadow-md'
                      : 'text-emerald-300/80 hover:text-white'
                  }`}
                >
                  Single Pass
                </button>
                <button
                  type="button"
                  onClick={() => setPassType('team')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-space font-extrabold transition-all cursor-pointer ${
                    passType === 'team'
                      ? 'bg-[#facc15] text-black shadow-md'
                      : 'text-emerald-300/80 hover:text-white'
                  }`}
                >
                  Team Pass
                </button>
              </div>
            </div>

            {/* 1. Photo Section */}
            <div className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-space font-bold text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#facc15]" />
                  <span>Builder Photo</span>
                </label>
                {photoUrl && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Uploaded
                  </span>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Upload Drop Area */}
              <div
                onClick={() => document.getElementById('passport-photo-input')?.click()}
                className="border border-dashed border-emerald-800/80 hover:border-[#facc15] bg-[#09100d] hover:bg-[#0b1410] rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                <input
                  id="passport-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-[#facc15]">
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-space font-semibold text-sm text-white">
                      {photoUrl ? 'Change Profile Photo' : 'Upload Profile Photo'}
                    </div>
                    <div className="font-sans text-xs text-emerald-400/70">
                      Supports JPG, PNG, WebP, HEIC or camera selfie.
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Adjustments Toggle */}
              {photoUrl && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdjustments(!showAdjustments)}
                    className="text-xs font-mono text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>{showAdjustments ? 'Hide Reframing Controls' : 'Adjust Crop & Zoom'}</span>
                  </button>

                  {showAdjustments && (
                    <div className="mt-3 p-4 bg-[#080d0b] border border-emerald-900/80 rounded-xl space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-emerald-300 mb-1">
                          <span>Zoom Level</span>
                          <span>{transform.zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.1"
                          value={transform.zoom}
                          onChange={(e) => setTransform({ ...transform, zoom: parseFloat(e.target.value) })}
                          className="w-full accent-[#facc15]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-emerald-300 mb-1">
                          <span>Horizontal Pan</span>
                          <span>{transform.panX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={transform.panX}
                          onChange={(e) => setTransform({ ...transform, panX: parseInt(e.target.value) })}
                          className="w-full accent-[#facc15]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Teammates Section */}
            {passType === 'team' && (
              <div className="space-y-6">
                {teammates.map((teammate, index) => (
                  <div key={index} className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-6 space-y-4 relative">
                    <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                      <div className="font-space font-bold text-sm text-white flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-[#facc15]" />
                        <span>Teammate #{index + 1} Details</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTeammates(teammates.filter((_, i) => i !== index));
                        }}
                        className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs text-emerald-300/80">Full Name</label>
                        <input
                          type="text"
                          value={teammate.name}
                          onChange={(e) => {
                            const newTeammates = [...teammates];
                            newTeammates[index].name = e.target.value;
                            setTeammates(newTeammates);
                          }}
                          placeholder="Teammate Name"
                          className="w-full bg-[#080d0b] border border-emerald-900 focus:border-[#facc15] text-white font-space font-semibold px-3.5 py-2.5 rounded-xl outline-none text-sm transition-colors"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs text-emerald-300/80">Primary Role</label>
                        <input
                          type="text"
                          value={teammate.role}
                          onChange={(e) => {
                            const newTeammates = [...teammates];
                            newTeammates[index].role = e.target.value;
                            setTeammates(newTeammates);
                          }}
                          placeholder="e.g. Developer, Designer..."
                          className="w-full bg-[#080d0b] border border-emerald-900 focus:border-[#facc15] text-white font-space font-semibold px-3.5 py-2.5 rounded-xl outline-none text-sm transition-colors"
                        />
                      </div>
                    </div>

                    {/* Teammate Photo Upload */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs text-emerald-300/80">Profile Photo</label>
                        {teammate.photoUrl && (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        )}
                      </div>
                      
                      <div
                        onClick={() => document.getElementById(`teammate-photo-input-${index}`)?.click()}
                        className="border border-dashed border-emerald-800/80 hover:border-[#facc15] bg-[#09100d] hover:bg-[#0b1410] rounded-xl p-4 text-center cursor-pointer transition-colors flex items-center justify-center gap-3"
                      >
                        <input
                          id={`teammate-photo-input-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const res = await processUploadedFile(file);
                                const newTeammates = [...teammates];
                                newTeammates[index].photoUrl = res.dataUrl;
                                setTeammates(newTeammates);
                              } catch (err) {
                                console.error('Teammate photo error:', err);
                              }
                            }
                          }}
                          className="hidden"
                        />
                        <Upload className="w-4 h-4 text-[#facc15]" />
                        <span className="font-space font-semibold text-xs text-white">
                          {teammate.photoUrl ? 'Change Photo' : 'Upload Photo'}
                        </span>
                      </div>
                    </div>

                    {/* Photo Adjustments */}
                    {teammate.photoUrl && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newTeammates = [...teammates];
                            newTeammates[index].showAdjustments = !newTeammates[index].showAdjustments;
                            setTeammates(newTeammates);
                          }}
                          className="text-[10px] font-mono text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3 h-3 text-[#facc15]" />
                          <span>{teammate.showAdjustments ? 'Hide Crop Controls' : 'Adjust Crop & Zoom'}</span>
                        </button>

                        {teammate.showAdjustments && (
                          <div className="mt-3 p-3 bg-[#080d0b] border border-emerald-900/80 rounded-xl space-y-3 font-mono text-[10px]">
                            <div>
                              <div className="flex justify-between text-emerald-300 mb-1">
                                <span>Zoom Level</span>
                                <span>{teammate.transform.zoom.toFixed(1)}x</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="2.5"
                                step="0.1"
                                value={teammate.transform.zoom}
                                onChange={(e) => {
                                  const newTeammates = [...teammates];
                                  newTeammates[index].transform.zoom = parseFloat(e.target.value);
                                  setTeammates(newTeammates);
                                }}
                                className="w-full accent-[#facc15]"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-emerald-300 mb-1">
                                <span>Horizontal Pan</span>
                                <span>{teammate.transform.panX}px</span>
                              </div>
                              <input
                                type="range"
                                min="-80"
                                max="80"
                                value={teammate.transform.panX}
                                onChange={(e) => {
                                  const newTeammates = [...teammates];
                                  newTeammates[index].transform.panX = parseInt(e.target.value);
                                  setTeammates(newTeammates);
                                }}
                                className="w-full accent-[#facc15]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {teammates.length < 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTeammates([...teammates, initialTeammateState()]);
                    }}
                    className="w-full py-3 bg-[#0e1512] hover:bg-emerald-950 text-[#facc15] border border-dashed border-emerald-800/80 rounded-2xl font-space font-extrabold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Teammate Details ({teammates.length}/2)</span>
                  </button>
                )}
              </div>
            )}

            {/* 2. Details Section */}
            <div className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-6 space-y-4">
              <div className="font-space font-bold text-sm text-white flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-[#facc15]" />
                <span>Builder Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-emerald-300/80">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harsh Raikwar"
                    className="w-full bg-[#080d0b] border border-emerald-900 focus:border-[#facc15] text-white font-space font-semibold px-3.5 py-2.5 rounded-xl outline-none text-sm transition-colors"
                  />
                </div>

                {/* Primary Role */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-emerald-300/80">Primary Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. AI / ML, Developer, Founder..."
                    className="w-full bg-[#080d0b] border border-emerald-900 focus:border-[#facc15] text-white font-space font-semibold px-3.5 py-2.5 rounded-xl outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-emerald-300/80">Tech Stack / Skills</label>
                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, TensorFlow..."
                  className="w-full bg-[#080d0b] border border-emerald-900 focus:border-[#facc15] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                />
                <p className="font-sans text-[11px] text-emerald-400/60">
                  Separate technologies with commas to display clean chip tags on your pass.
                </p>
              </div>

              {/* Tagline / Title Quote */}
              <div className="p-3.5 bg-[#080d0b] rounded-xl border border-emerald-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-emerald-300/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>Tagline Quote</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setTitleVariant((v) => v + 1)}
                    className="text-xs font-mono text-[#facc15] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-roll Tagline
                  </button>
                </div>
                <div className="font-sans italic text-sm text-yellow-300 font-semibold">
                  {builderTitle}
                </div>
              </div>
            </div>

            {/* 3. Theme Palette Selector */}
            <div className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-6 space-y-3">
              <label className="font-space font-bold text-sm text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#facc15]" />
                <span>Card Theme Color</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CARD_THEMES.map((theme) => {
                  const isSelected = themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={`p-3 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#facc15] bg-[#facc15]/10 text-white font-bold ring-1 ring-[#facc15]'
                          : 'border-emerald-900/80 bg-[#080d0b] text-emerald-300 hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.cardBg }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.headerLogo }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.bracketsColor }}
                        />
                      </div>
                      <div className="font-mono text-xs truncate">{theme.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Card Preview & Actions */}
          <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-20">
            <div className="bg-[#0e1512] border border-emerald-900/60 rounded-2xl p-6 space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-space font-bold text-lg text-white">
                  Live Builder Card
                </h2>
                <p className="font-sans text-xs text-emerald-400/80">
                  Real-time preview ready to download as high-res PNG.
                </p>
              </div>

              {/* Card Container */}
              <div className="p-2 sm:p-4 bg-[#080d0b] rounded-2xl border border-emerald-900/80 flex items-center justify-center">
                <CardPreview details={builderDetails} />
              </div>

              {/* Download & Share Actions */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => handleDownload(builderDetails)}
                  disabled={isDownloading}
                  className="w-full py-3.5 bg-[#facc15] hover:bg-yellow-300 text-black font-space font-extrabold text-sm uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generating Image...' : 'Download Pass (PNG)'}</span>
                </button>

                <button
                  onClick={() => handleShare(builderDetails)}
                  disabled={isSharing}
                  className="w-full py-3 bg-[#080d0b] hover:bg-emerald-950 text-white border border-emerald-800 font-space font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4 text-[#facc15]" />
                  <span>{isSharing ? 'Preparing Share...' : 'Share on X (#FrameInGoa)'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Share Notification Modal */}
      {shareNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1512] border border-emerald-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
              <h3 className="font-space font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#facc15]" />
                <span>{shareNotice.title}</span>
              </h3>
              <button
                onClick={() => setShareNotice(null)}
                className="text-emerald-400 hover:text-white font-mono text-sm px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-sans text-sm text-emerald-200 leading-relaxed">
              {shareNotice.message}
            </p>

            {shareNotice.clipboardSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-xl font-mono text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pass Image is in Clipboard! Ctrl+V (or Cmd+V) to paste in Twitter composer.</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleDownload();
                  setShareNotice(null);
                }}
                className="flex-1 py-2.5 bg-[#facc15] hover:bg-yellow-300 text-black font-space font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={() => setShareNotice(null)}
                className="px-4 py-2.5 bg-[#080d0b] hover:bg-emerald-900 text-emerald-300 font-mono text-xs rounded-xl cursor-pointer border border-emerald-800"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-emerald-900/60 py-6 px-4 text-center font-mono text-xs text-emerald-400/70 bg-[#0a0f0d] mt-12">
        <div>
          HACKER HOUSE GOA 2026 • OFFICIAL BUILDER PASSPORT STUDIO
        </div>
      </footer>
    </div>
  );
}
