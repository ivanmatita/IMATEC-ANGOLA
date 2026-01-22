
export interface Empresa {
  id: string;
  nome: string;
  nif: string;
  endereco: string;
  email_admin: string;
  telefone: string;
  logo_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  empresa_id: string;
  nome: string;
  email: string;
  role: 'admin' | 'operador' | 'contabilista';
}

export interface Produto {
  id: string;
  empresa_id: string;
  nome: string;
  preco: number;
  stock: number;
  categoria: string;
  unidade: string;
}

export interface Fatura {
  id: string;
  empresa_id: string;
  numero: string;
  cliente_nome: string;
  cliente_nif: string;
  data_emissao: string;
  total_liquido: number;
  total_imposto: number;
  total_geral: number;
  estado: 'pago' | 'pendente' | 'anulado';
}

// --- RH MODULE TYPES ---
export type TipoContrato = 'Indeterminado' | 'Termo Certo' | 'Termo Incerto' | 'Estágio';
export type EstadoFuncionario = 'Ativo' | 'Inativo' | 'Férias' | 'Suspenso';

export interface Funcionario {
  id: string;
  empresa_id: string;
  nome: string;
  bi: string;
  nif: string;
  data_nascimento: string;
  estado_civil: string;
  nacionalidade: string;
  morada: string;
  contacto: string;
  email: string;
  profissao: string;
  cargo: string;
  tipo_contrato: TipoContrato;
  data_admissao: string;
  salario_base: number;
  dependentes: number;
  regime_trabalho: string;
  estado: EstadoFuncionario;
  data_cessacao?: string;
  motivo_cessacao?: string;
}

export interface EfetividadeDiaria {
  id: string;
  funcionario_id: string;
  empresa_id: string;
  mes: number;
  ano: number;
  registos: Record<number, 'FOLGA' | 'SERVIÇO' | 'JUSTIFICADA' | 'INJUSTIFICADA' | 'FÉRIAS'>;
  horas_extra: Record<number, number>;
  horas_perdidas: Record<number, number>;
  // Campos adicionais editáveis
  abonos: number;
  subsidios: number;
  premios: number;
  adiantamentos: number;
  observacoes: string;
}

export interface ProcessamentoSalario {
  id: string;
  empresa_id: string;
  funcionario_id: string;
  mes: number;
  ano: number;
  salario_base: number;
  complemento_salarial: number;
  faltas_desconto: number;
  horas_extras_valor: number;
  horas_perdidas_valor: number;
  subsidio_ferias: number;
  subsidio_natal: number;
  abono_familia: number;
  subsidio_transporte: number;
  subsidio_alimentacao: number;
  subsidio_alojamento: number;
  irt: number;
  inss_trabalhador: number; // 3%
  inss_patronal: number;    // 8%
  premios: number;
  adiantamentos: number;
  liquido: number;
  data_processamento: string;
  estado: 'Pendente' | 'Processado';
}

export interface DocumentoFuncionario {
  id: string;
  funcionario_id: string;
  empresa_id: string;
  nome: string;
  tipo: 'BI' | 'NIF' | 'Contrato' | 'Outros';
  url: string;
  data_upload: string;
}

export enum AppRoute {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
  FATURACAO = '/faturacao',
  CONTABILIDADE = '/contabilidade',
  STOCK = '/stock',
  FORNECEDORES = '/fornecedores',
  POS = '/pos',
  RH = '/rh',
  ADMIN = '/admin',
  CONFIG = '/config'
}
