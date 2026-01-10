import React, { useState } from 'react';
import { MessageSquare, X, Send, Upload, Bug, Lightbulb, Heart } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackCategory = 'BUG' | 'FEATURE' | 'PRAISE';

interface FeedbackData {
  message: string;
  category: FeedbackCategory;
  attachment?: string; // Base64 ou URL
  attachmentName?: string;
  submittedBy?: string;
  submittedAt: string;
}

const FeedbackFAB: React.FC = () => {
  const { submitFeedback, currentUserId } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<{
    message: string;
    category: FeedbackCategory;
    attachment: string | null;
    attachmentName: string;
  }>({
    message: '',
    category: 'FEATURE',
    attachment: null,
    attachmentName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          attachment: reader.result as string,
          attachmentName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        message: formData.message,
        category: formData.category,
        attachment: formData.attachment || undefined,
        attachmentName: formData.attachmentName || undefined,
        submittedBy: currentUserId || 'Usuário Anônimo',
        submittedAt: new Date().toISOString(),
      });

      // Reset form
      setFormData({
        message: '',
        category: 'FEATURE',
        attachment: null,
        attachmentName: '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryConfig = {
    BUG: { label: 'Bug', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    FEATURE: { label: 'Sugestão de Função', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    PRAISE: { label: 'Elogio', icon: Heart, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
        title="Enviar Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Enviar Feedback</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Categoria */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Categoria</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(categoryConfig).map(([key, config]) => {
                        const CategoryIcon = config.icon;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: key as FeedbackCategory })}
                            className={`p-3 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${
                              formData.category === key
                                ? config.color + ' border-current'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <CategoryIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">{config.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">O que pode melhorar?</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva seu feedback, sugestão ou elogio..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none resize-none"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Anexo */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Anexo de Print (Opcional)</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        {formData.attachmentName || 'Selecionar arquivo'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {formData.attachment && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, attachment: null, attachmentName: '' })}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {formData.attachment && (
                      <div className="mt-2">
                        <img
                          src={formData.attachment}
                          alt="Preview"
                          className="max-w-full h-32 object-contain rounded-md border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!formData.message.trim() || isSubmitting}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Feedback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackFAB;
