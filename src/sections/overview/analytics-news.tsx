import { useState, useEffect } from 'react';

// Imports de componentes do Material-UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// Imports internos da sua aplicação (ordem corrigida)
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import supabase from 'src/lib/supabaseClient'; 

// ----------------------------------------------------------------------

// Tipos para os dados do seu banco
type Pedido = {
  id: number;
  numero_pedido: string;
  data_pedido: string;
  situacao: string;
  id_api_pedido: number;
  valor_produtos: number;
  valor_frete: number;
  valor_desconto: number;
  valor_total_pedido: number;
};

type ItemPedido = {
  id_item: number;
  produto_id_api: number;
  quantidade: number;
  valor_unitario: number;
};

// ----------------------------------------------------------------------

export function AnalyticsNews() {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [loading, setLoading] = useState(true);

  // ID do pedido que queremos exibir. Altere para testar.
  const ID_DO_PEDIDO_PARA_BUSCAR = 1;

  useEffect(() => {
    async function fetchOrderDetails() {
      setLoading(true);

      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', ID_DO_PEDIDO_PARA_BUSCAR)
        .single();

      if (pedidoError || !pedidoData) {
        console.error('Erro ao buscar pedido:', pedidoError);
        setLoading(false);
        return;
      }

      setPedido(pedidoData);

      const { data: itensData } = await supabase
        .from('itens_pedido')
        .select('*')
        .eq('pedido_id_api', pedidoData.id_api_pedido);

      if (itensData) {
        setItens(itensData);
      }

      setLoading(false);
    }

    fetchOrderDetails();
  }, []);

  if (loading) {
    return <Card><CardHeader title="Carregando detalhes do pedido..." /></Card>;
  }

  if (!pedido) {
    return <Card><CardHeader title="Pedido não encontrado." /></Card>;
  }

  return (
    <Card>
      <CardHeader 
        title={`Detalhes do Pedido #${pedido.numero_pedido}`}
        subheader={`Data: ${fDate(pedido.data_pedido)}`}
      />

      <Stack sx={{ p: 3 }} spacing={3}>
        <Stack spacing={2}>
          <Typography variant="h6">Resumo Financeiro</Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Subtotal (produtos)</Typography>
            <Typography variant="subtitle2">{fCurrency(pedido.valor_produtos)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Frete</Typography>
            <Typography variant="subtitle2">{fCurrency(pedido.valor_frete)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Desconto</Typography>
            <Typography variant="subtitle2" color="error.main">-{fCurrency(pedido.valor_desconto)}</Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Total</Typography>
            <Typography variant="h5">{fCurrency(pedido.valor_total_pedido)}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={2}>
          <Typography variant="h6">Itens do Pedido ({itens.length})</Typography>
          {itens.map((item) => (
            <Stack key={item.id_item} direction="row" spacing={2} alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">Produto ID: {item.produto_id_api}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.quantidade} x {fCurrency(item.valor_unitario)}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
                {fCurrency(item.quantidade * item.valor_unitario)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}