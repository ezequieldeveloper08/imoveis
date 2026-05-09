'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Layout, 
  Settings2, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  Copy,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Key,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConnectionMethod = 'official' | 'evolution';

const STEPS = [
  { id: 'welcome', title: 'Boas-vindas', icon: MessageSquare },
  { id: 'method', title: 'Provedor', icon: Globe },
  { id: 'setup', title: 'Configuração', icon: Settings2 },
  { id: 'ai', title: 'Agente IA', icon: Bot },
];

export default function WhatsappOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod | null>(null);

  const nextStep = () => {
    if (currentStep === 1 && !connectionMethod) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-grey-08 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-12 relative">
          <div className="absolute top-1/2 left-24 right-24 h-px bg-grey-15 -translate-y-1/2 z-0" />
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                  isActive ? "bg-purple-60 border-purple-60 text-white shadow-xl shadow-purple-60/20 scale-110" :
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                  "bg-grey-10 border-grey-15 text-grey-60"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  isActive ? "text-white" : "text-grey-60"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Card */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-grey-10 border border-grey-15 rounded-3xl p-12 pb-20 shadow-2xl shadow-purple-60/5 min-h-[550px] flex flex-col"
        >
          
          {/* STEP 0: WELCOME */}
          {currentStep === 0 && (
            <div className="flex-1 flex flex-col items-center text-center justify-center space-y-8">
              <div className="h-24 w-24 rounded-3xl bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60">
                <Zap className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">WhatsApp Enterprise</h2>
                <p className="text-grey-50 max-w-md mx-auto leading-relaxed">
                  Conecte sua imobiliária à comunicação profissional e ative a inteligência artificial para qualificar seus leads 24/7.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl text-left mb-12">
                {[
                  { icon: Bot, t: 'IA Autônoma', d: 'Qualificação via LLM' },
                  { icon: ShieldCheck, t: 'Multi-Provider', d: 'Oficial ou Evolution' },
                  { icon: Zap, t: 'Real-time', d: 'Sincronização total' }
                ].map((f, i) => (
                  <div key={i} className="p-4 bg-grey-08 rounded-2xl border border-grey-15">
                    <f.icon className="h-5 w-5 text-purple-60 mb-2" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{f.t}</p>
                    <p className="text-[9px] text-grey-60">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: CHOOSE METHOD */}
          {currentStep === 1 && (
            <div className="flex-1 space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-black text-white tracking-tight">Escolha o seu Provedor</h3>
                <p className="text-grey-50 text-sm mt-2">Selecione como deseja conectar sua conta de WhatsApp.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setConnectionMethod('official')}
                  className={cn(
                    "p-8 rounded-3xl border-2 text-left transition-all group relative overflow-hidden",
                    connectionMethod === 'official' 
                      ? "bg-purple-60/10 border-purple-60 shadow-xl shadow-purple-60/10" 
                      : "bg-grey-08 border-grey-15 hover:border-grey-30"
                  )}
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <Layout className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2">Cloud API (Oficial)</h4>
                  <p className="text-xs text-grey-50 leading-relaxed">
                    Ideal para grandes volumes e estabilidade máxima. Requer conta comercial na Meta (Facebook).
                  </p>
                  {connectionMethod === 'official' && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-purple-60 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </button>

                <button 
                  onClick={() => setConnectionMethod('evolution')}
                  className={cn(
                    "p-8 rounded-3xl border-2 text-left transition-all group relative overflow-hidden",
                    connectionMethod === 'evolution' 
                      ? "bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/10" 
                      : "bg-grey-08 border-grey-15 hover:border-grey-30"
                  )}
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2">Evolution API</h4>
                  <p className="text-xs text-grey-50 leading-relaxed">
                    Mais flexível. Permite conectar números físicos via QR Code e facilita o uso de webhooks personalizados.
                  </p>
                  {connectionMethod === 'evolution' && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SETUP (CONDITIONAL) */}
          {currentStep === 2 && (
            <div className="flex-1 space-y-8">
              {connectionMethod === 'official' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
                      <Layout className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Cloud API Setup</h3>
                      <p className="text-grey-50 text-sm">Autentique e configure seus IDs da Meta.</p>
                    </div>
                  </div>

                  <div className="p-8 bg-grey-08 rounded-3xl border border-grey-15 flex flex-col items-center text-center gap-6 mb-8">
                     <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
                        <Layout className="h-7 w-7 fill-blue-600" />
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-10 rounded-xl">
                        Conectar com Facebook
                      </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Phone Number ID', placeholder: 'Ex: 109283...' },
                      { label: 'WABA ID', placeholder: 'Ex: 928374...' },
                    ].map((field) => (
                      <div key={field.label} className="space-y-2">
                        <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">{field.label}</label>
                        <input className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 px-4 text-sm text-white focus:border-purple-60 outline-none" placeholder={field.placeholder} />
                      </div>
                    ))}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">Permanent Access Token</label>
                      <input className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 px-4 text-sm text-white focus:border-purple-60 outline-none" placeholder="EAAG..." />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Database className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Evolution API Setup</h3>
                      <p className="text-grey-50 text-sm">Configure os detalhes do seu servidor Evolution.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">Server URL</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-60" />
                        <input className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none" placeholder="https://api.evolution.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">Instance Name</label>
                        <input className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 px-4 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Ex: Simovel_Alpha" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">Global API Key</label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-60" />
                          <input type="password" className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none" placeholder="••••••••••••" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-grey-08 rounded-3xl border border-grey-15 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Pronto para QR Code</p>
                        <p className="text-xs text-grey-50">Após salvar, você poderá ler o QR Code no dashboard.</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: AI CONFIG */}
          {currentStep === 3 && (
            <div className="flex-1 space-y-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center text-purple-600">
                  <Bot className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Personalidade da IA</h3>
                  <p className="text-grey-50 text-sm">Defina como o agente deve interagir com seus leads.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-grey-40 uppercase tracking-widest ml-1">Instruções do Sistema (Prompt)</label>
                  <textarea 
                    className="w-full bg-grey-08 border border-grey-15 rounded-2xl p-6 text-sm text-white focus:border-purple-60 outline-none transition-all min-h-[160px] resize-none leading-relaxed"
                    placeholder="Ex: Você é a Bia, assistente virtual da Simovel. Seja cordial..."
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-grey-08 rounded-2xl border border-grey-15">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-60/10 flex items-center justify-center text-purple-60">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Transferência Automática</p>
                      <p className="text-xs text-grey-60">Notificar humano quando o lead estiver qualificado.</p>
                    </div>
                  </div>
                  <div className="h-7 w-14 bg-grey-15 rounded-full relative p-1 cursor-pointer">
                    <div className="h-5 w-5 bg-purple-60 rounded-full shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-auto pt-8 flex items-center justify-between border-t border-grey-15">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-grey-50 hover:text-white flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button 
              onClick={nextStep}
              disabled={currentStep === 1 && !connectionMethod}
              className={cn(
                "font-bold h-12 px-8 rounded-xl shadow-xl flex items-center gap-2 transition-all",
                currentStep === 1 && !connectionMethod ? "bg-grey-15 text-grey-60 opacity-50 cursor-not-allowed" :
                connectionMethod === 'evolution' ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" :
                "bg-purple-60 hover:bg-purple-65 text-white shadow-purple-60/20"
              )}
            >
              {currentStep === STEPS.length - 1 ? 'Finalizar Configuração' : 'Próximo Passo'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
