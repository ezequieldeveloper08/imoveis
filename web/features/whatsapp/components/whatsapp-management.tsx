'use client';

import { useState, useEffect } from 'react';
import {
  Zap,
  RefreshCw,
  Trash2,
  LogOut,
  Plus,
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { whatsappService, WhatsappInstance } from '../services/whatsapp.service';
import Image from 'next/image';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/use-auth';

export function WhatsAppManagement() {
  const { getToken } = useAuth();
  const [instance, setInstance] = useState<WhatsappInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'MESSAGES_UPSERT',
    'CONNECTION_UPDATE'
  ]);
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);

  const availableEvents = [
    { id: 'MESSAGES_UPSERT', label: 'Novas Mensagens', description: 'Receber notificações de mensagens recebidas' },
    { id: 'MESSAGES_UPDATE', label: 'Status de Mensagem', description: 'Atualizações de leitura e entrega' },
    { id: 'CONNECTION_UPDATE', label: 'Status da Conexão', description: 'Notificar quando conectar/desconectar' },
    { id: 'QRCODE_UPDATED', label: 'Mudança de QR Code', description: 'Receber novo QR Code automaticamente' },
    { id: 'SEND_MESSAGE', label: 'Mensagens Enviadas', description: 'Logs de mensagens enviadas pelo sistema' },
  ];

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchInstances();
      const interval = setInterval(fetchInstances, 10000);
      return () => clearInterval(interval);
    }
  }, [getToken]);

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSaveWebhook = async () => {
    if (selectedEvents.length === 0) {
      toast.error('Selecione pelo menos um evento');
      return;
    }

    const token = getToken();
    if (!token) return;

    setIsSavingWebhook(true);
    try {
      await whatsappService.setWebhookConfig(selectedEvents, token);
      toast.success('Configuração de Webhook salva!');
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const fetchInstances = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const data = await whatsappService.getInstances(token);
      if (Array.isArray(data) && data.length > 0) {
        setInstance(data[0]);
        if (data[0].webhookEvents) setSelectedEvents(data[0].webhookEvents);
      } else {
        setInstance(null);
      }
    } catch (error) {
      console.error('Failed to fetch instances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstance = async () => {
    const token = getToken();
    if (!token) return;

    setIsCreating(true);
    try {
      await whatsappService.createInstance('', token);
      toast.success('Instância inicializada! Escaneie o QR Code para conectar.');
      fetchInstances();
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleShowQR = async () => {
    if (!instance) return;
    const token = getToken();
    if (!token) return;

    setShowQRModal(true);
    setQrCode(null);
    try {
      const data = await whatsappService.getQrCode(instance.name, token);
      if (data && data.base64) {
        setQrCode(data.base64);
      }
    } catch (error) {
      console.error('Failed to get QR Code:', error);
    }
  };

  const handleLogout = async () => {
    if (!instance) return;
    const token = getToken();
    if (!token) return;

    if (!confirm(`Tem certeza que deseja desconectar o WhatsApp?`)) return;
    try {
      await whatsappService.logout(instance.name, token);
      fetchInstances();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-purple-60" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Zap className="h-6 w-6 text-purple-60" />
            Configurações do WhatsApp
          </h2>
          <p className="text-grey-60 mt-1 text-sm font-medium uppercase tracking-wider">Gerenciamento Evolution API v2</p>
        </div>
      </div>

      {!instance ? (
        <div className="bg-grey-10 border border-grey-15 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-60/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-purple-60/10 transition-all duration-1000" />
          
          <div className="h-24 w-24 bg-purple-60/10 border border-purple-60/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
             <Smartphone className="h-10 w-10 text-purple-60" />
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Primeira Configuração</h3>
          <p className="text-grey-50 max-w-md mx-auto text-base leading-relaxed mb-10">
            Sua organização ainda não possui uma instância de WhatsApp. Clique abaixo para inicializar sua conexão exclusiva.
          </p>
          
          <Button 
            onClick={handleCreateInstance}
            disabled={isCreating}
            className="bg-purple-60 hover:bg-purple-65 text-white-pure h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-60/20 active:scale-95 transition-all"
          >
            {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-3" />}
            Inicializar WhatsApp
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-grey-10 border border-grey-15 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-60/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    instance.connectionStatus === 'open' 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    <div className={cn("h-2 w-2 rounded-full", instance.connectionStatus === 'open' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                    {instance.connectionStatus === 'open' ? 'Conexão Ativa' : 'Aguardando Pareamento'}
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tight">
                    {instance.profileName || 'WhatsApp'}
                  </h3>
                  <p className="text-grey-50 font-bold uppercase tracking-widest text-[10px]">
                    ID da Instância: <span className="text-white ml-1">{instance.name}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                   {instance.connectionStatus === 'open' ? (
                     <Button 
                        onClick={handleLogout}
                        variant="outline" 
                        className="h-12 w-12 rounded-2xl border-grey-15 bg-grey-08 text-grey-50 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 transition-all"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                   ) : (
                      <Button 
                        onClick={handleShowQR}
                        className="h-12 px-6 rounded-2xl bg-white text-grey-08 font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-grey-20 transition-all"
                      >
                        <QrCode className="h-4 w-4 mr-2" /> Conectar
                      </Button>
                   )}
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 relative z-10">
                 <div className="bg-grey-08/50 border border-grey-15 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-grey-60 uppercase tracking-widest mb-3">Status da API</p>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                       <span className="text-sm font-bold text-white">Sincronizado</span>
                    </div>
                 </div>
                 <div className="bg-grey-08/50 border border-grey-15 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-grey-60 uppercase tracking-widest mb-3">Última Mensagem</p>
                    <div className="flex items-center gap-3">
                       <Clock className="h-5 w-5 text-purple-60" />
                       <span className="text-sm font-bold text-white">Agora mesmo</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-grey-10 border border-grey-15 rounded-[2.5rem] p-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-purple-60/10 border border-purple-60/20 flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-purple-60" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight">Eventos do Webhook</h4>
                      <p className="text-grey-50 text-xs font-bold uppercase tracking-widest mt-1">Sincronização em Tempo Real</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSaveWebhook}
                    disabled={isSavingWebhook}
                    className="h-12 px-8 rounded-2xl bg-purple-60 hover:bg-purple-65 text-white-pure font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-60/20 transition-all"
                  >
                    {isSavingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar Eventos'}
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={cn(
                        "flex items-start gap-4 p-5 rounded-[2rem] border transition-all text-left group",
                        selectedEvents.includes(event.id)
                          ? "bg-purple-60/10 border-purple-60/30 ring-1 ring-purple-60/20"
                          : "bg-grey-08 border-grey-15 hover:border-grey-20"
                      )}
                    >
                      <div className={cn(
                        "h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                        selectedEvents.includes(event.id)
                          ? "bg-purple-60 border-purple-60 text-white-pure"
                          : "bg-grey-10 border-grey-20 text-transparent group-hover:border-grey-30"
                      )}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={cn(
                          "text-xs font-black uppercase tracking-widest mb-1 transition-colors",
                          selectedEvents.includes(event.id) ? "text-white" : "text-grey-40"
                        )}>
                          {event.label}
                        </p>
                        <p className="text-grey-60 text-[10px] leading-relaxed font-medium">
                          {event.description}
                        </p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Side Panel: Info */}
          <div className="space-y-8">
             <div className="bg-purple-60 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-purple-60/20 relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
                <h4 className="text-xl font-black mb-4 tracking-tight">Dica Pro</h4>
                <p className="text-purple-90 text-sm font-bold leading-relaxed">
                  Utilize o Ngrok para testes locais. Lembre-se que a URL deve terminar com /whatsapp/webhook para que as mensagens cheguem corretamente.
                </p>
             </div>
             
             <div className="bg-grey-10 border border-grey-15 rounded-[2.5rem] p-10 space-y-6">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Documentação</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold text-grey-50">Evolution API v2.1.0</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-purple-60" />
                      <span className="text-[11px] font-bold text-grey-50">Multi-device Supported</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowQRModal(false)} />
          <div className="bg-grey-10 border border-grey-15 w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-3xl animate-in zoom-in-95 duration-500 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-60 to-emerald-500" />
             
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-8 right-8 h-10 w-10 rounded-xl bg-grey-15 flex items-center justify-center text-grey-60 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Parear WhatsApp</h3>
              <p className="text-grey-50 text-[10px] font-black uppercase tracking-widest">Escaneie o código abaixo</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] mx-auto w-fit mb-10 shadow-[0_0_80px_rgba(112,59,247,0.25)] ring-8 ring-white/5">
              {qrCode ? (
                <Image 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  width={260} 
                  height={260} 
                  className="rounded-lg"
                />
              ) : (
                <div className="h-[260px] w-[260px] flex flex-col items-center justify-center text-grey-08">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-60 mb-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Gerando Código...</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 bg-grey-08 p-5 rounded-[1.5rem] border border-grey-15">
                <div className="h-8 w-8 rounded-xl bg-purple-60 flex items-center justify-center text-white-pure text-xs font-black shadow-lg shadow-purple-60/20">1</div>
                <p className="text-grey-40 text-xs font-bold leading-relaxed">Abra o WhatsApp e vá em <span className="text-white">Aparelhos Conectados</span>.</p>
              </div>
              <div className="flex items-center gap-4 bg-grey-08 p-5 rounded-[1.5rem] border border-grey-15">
                <div className="h-8 w-8 rounded-xl bg-purple-60 flex items-center justify-center text-white-pure text-xs font-black shadow-lg shadow-purple-60/20">2</div>
                <p className="text-grey-40 text-xs font-bold leading-relaxed">Aponte a câmera para esta tela para parear seu celular.</p>
              </div>
            </div>

            <Button 
              onClick={handleShowQR}
              variant="ghost"
              className="w-full h-14 rounded-2xl text-purple-60 hover:text-purple-70 hover:bg-purple-60/5 font-black uppercase tracking-widest text-[10px] transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-3" /> Atualizar QR Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
