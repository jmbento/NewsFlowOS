import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Users,
  Building2,
  Palette,
  Folder,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cores da marca
const BRAND_COLORS = [
  { name: 'Primary Purple', hex: '#8B5CF6', usage: 'Principal' },
  { name: 'Primary Blue', hex: '#3B82F6', usage: 'Secundário' },
  { name: 'Emerald', hex: '#10B981', usage: 'Sucesso' },
  { name: 'Amber', hex: '#F59E0B', usage: 'Atenção' },
  { name: 'Slate 900', hex: '#0F172A', usage: 'Texto' },
  { name: 'Slate 100', hex: '#F1F5F9', usage: 'Background' },
];

// Estrutura de assets (mock - em produção viria de API/storage)
const BRAND_ASSETS = {
  logos: {
    vectors: [
      { id: 'logo-vector-1', name: 'Logo Principal.svg', url: '/brand/logos/logo-principal.svg', format: 'SVG' },
      { id: 'logo-vector-2', name: 'Logo Horizontal.svg', url: '/brand/logos/logo-horizontal.svg', format: 'SVG' },
      { id: 'logo-vector-3', name: 'Logo Vertical.svg', url: '/brand/logos/logo-vertical.svg', format: 'SVG' },
      { id: 'logo-ai-1', name: 'Logo Principal.ai', url: '/brand/logos/logo-principal.ai', format: 'AI' },
    ],
    bitmaps: [
      { id: 'logo-png-1', name: 'Logo Principal.png', url: '/brand/logos/logo-principal.png', format: 'PNG', size: '1920x1080' },
      { id: 'logo-png-2', name: 'Logo Horizontal.png', url: '/brand/logos/logo-horizontal.png', format: 'PNG', size: '1920x1080' },
      { id: 'logo-png-3', name: 'Logo Vertical.png', url: '/brand/logos/logo-vertical.png', format: 'PNG', size: '1920x1080' },
      { id: 'logo-png-4', name: 'Logo Favicon.png', url: '/brand/logos/logo-favicon.png', format: 'PNG', size: '512x512' },
    ],
  },
  estrutura: [
    { id: 'est-1', name: 'Sede Externa.jpg', url: '/brand/estrutura/sede-externa.jpg', category: 'Sede' },
    { id: 'est-2', name: 'Sede Interna.jpg', url: '/brand/estrutura/sede-interna.jpg', category: 'Sede' },
    { id: 'est-3', name: 'Estúdio A.jpg', url: '/brand/estrutura/estudio-a.jpg', category: 'Equipamentos' },
    { id: 'est-4', name: 'Estúdio B.jpg', url: '/brand/estrutura/estudio-b.jpg', category: 'Equipamentos' },
    { id: 'est-5', name: 'Equipamentos de Captação.jpg', url: '/brand/estrutura/equipamentos-captacao.jpg', category: 'Equipamentos' },
    { id: 'est-6', name: 'Frota de Veículos.jpg', url: '/brand/estrutura/frota-veiculos.jpg', category: 'Equipamentos' },
  ],
  diretoria: [
    { id: 'dir-1', name: 'Diretor Executivo.jpg', url: '/brand/diretoria/diretor-executivo.jpg', role: 'Diretor Executivo' },
    { id: 'dir-2', name: 'Editora Chefe.jpg', url: '/brand/diretoria/editora-chefe.jpg', role: 'Editora Chefe' },
    { id: 'dir-3', name: 'Coordenador Audiovisual.jpg', url: '/brand/diretoria/coordenador-audiovisual.jpg', role: 'Coordenador Audiovisual' },
  ],
  documentos: [
    { id: 'doc-1', name: 'Media Kit 2026.pptx', url: '/brand/documentos/media-kit-2026.pptx', format: 'PPTX', type: 'Media Kit' },
    { id: 'doc-2', name: 'Media Kit Canva', url: 'https://canva.com/template/example', format: 'Canva Link', type: 'Media Kit', isExternal: true },
    { id: 'doc-3', name: 'Manual de Identidade Visual.pdf', url: '/brand/documentos/manual-identidade-visual.pdf', format: 'PDF', type: 'Manual' },
  ],
};

type Section = 'logos' | 'estrutura' | 'diretoria' | 'documentos' | 'cores';

const BrandHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('logos');
  const [activeSubsection, setActiveSubsection] = useState<'vectors' | 'bitmaps'>('vectors');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownload = (url: string, name: string) => {
    // Simulação de download - em produção faria download real
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`📥 Download: ${name}`);
  };

  const handleCopyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredAssets = () => {
    if (!searchQuery) return BRAND_ASSETS[activeSection as keyof typeof BRAND_ASSETS];

    const query = searchQuery.toLowerCase();
    if (activeSection === 'logos') {
      const vectors = BRAND_ASSETS.logos.vectors.filter((a) => a.name.toLowerCase().includes(query));
      const bitmaps = BRAND_ASSETS.logos.bitmaps.filter((a) => a.name.toLowerCase().includes(query));
      return { vectors, bitmaps };
    }
    if (activeSection === 'estrutura') {
      return BRAND_ASSETS.estrutura.filter((a) => a.name.toLowerCase().includes(query));
    }
    if (activeSection === 'diretoria') {
      return BRAND_ASSETS.diretoria.filter((a) => a.name.toLowerCase().includes(query));
    }
    if (activeSection === 'documentos') {
      return BRAND_ASSETS.documentos.filter((a) => a.name.toLowerCase().includes(query));
    }
    return BRAND_ASSETS[activeSection as keyof typeof BRAND_ASSETS];
  };

  return (
    <div className="w-full h-full bg-slate-50 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Brand Hub</h1>
            <p className="text-sm text-slate-600 mt-1">Repositório de assets da marca Diário do Vale</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none w-64"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {(['logos', 'estrutura', 'diretoria', 'documentos', 'cores'] as Section[]).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                activeSection === section
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {section === 'logos' && 'Logos'}
              {section === 'estrutura' && 'Estrutura'}
              {section === 'diretoria' && 'Diretoria'}
              {section === 'documentos' && 'Documentos'}
              {section === 'cores' && 'Cores'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* LOGOS Section */}
          {activeSection === 'logos' && (
            <div className="space-y-6">
              {/* Subsection Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubsection('vectors')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeSubsection === 'vectors'
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Folder className="w-4 h-4 inline mr-2" />
                  Vetores (.svg / .ai)
                </button>
                <button
                  onClick={() => setActiveSubsection('bitmaps')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeSubsection === 'bitmaps'
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Bitmaps (.png)
                </button>
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredAssets() as any)[activeSubsection]?.map((asset: any) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-300 rounded-md p-4 hover:shadow-md transition-all"
                  >
                    <div className="aspect-video bg-slate-100 rounded-md mb-3 flex items-center justify-center border border-slate-200">
                      {asset.format === 'SVG' || asset.format === 'AI' ? (
                        <FileText className="w-12 h-12 text-slate-400" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{asset.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {asset.format} {asset.size && `• ${asset.size}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(asset.url, asset.name)}
                      className="w-full px-3 py-2 bg-black text-white rounded-md text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ESTRUTURA Section */}
          {activeSection === 'estrutura' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredAssets() as any[]).map((asset: any) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-300 rounded-md overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-slate-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{asset.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{asset.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(asset.url, asset.name)}
                      className="w-full px-3 py-2 bg-black text-white rounded-md text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* DIRETORIA Section */}
          {activeSection === 'diretoria' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredAssets() as any[]).map((asset: any) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-300 rounded-md overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    <Users className="w-16 h-16 text-slate-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{asset.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{asset.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(asset.url, asset.name)}
                      className="w-full px-3 py-2 bg-black text-white rounded-md text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* DOCUMENTOS Section */}
          {activeSection === 'documentos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredAssets() as any[]).map((asset: any) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-300 rounded-md p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center border border-purple-200">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{asset.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {asset.format} • {asset.type}
                      </p>
                    </div>
                  </div>
                  {asset.isExternal ? (
                    <button
                      onClick={() => handleOpenExternal(asset.url)}
                      className="w-full px-3 py-2 bg-purple-500 text-white rounded-md text-xs font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Abrir no Canva
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(asset.url, asset.name)}
                      className="w-full px-3 py-2 bg-black text-white rounded-md text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* CORES Section */}
          {activeSection === 'cores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRAND_COLORS.map((color) => (
                <motion.div
                  key={color.hex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-300 rounded-md p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-16 h-16 rounded-md border-2 border-slate-200 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900">{color.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{color.usage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-900">
                      {color.hex}
                    </div>
                    <button
                      onClick={() => handleCopyColor(color.hex)}
                      className={`px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${
                        copiedColor === color.hex
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black text-white hover:opacity-90'
                      }`}
                    >
                      {copiedColor === color.hex ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BrandHub;
