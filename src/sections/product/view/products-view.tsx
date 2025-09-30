import { useState, useCallback, useEffect } from 'react';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

// Imports Internos (Absolutos)
import supabase from 'src/lib/supabaseClient'; 
import { DashboardContent } from 'src/layouts/dashboard';

// Imports Internos (Relativos)
import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../product-cart-widget';
import { ProductFilters } from '../product-filters';

// Import de Tipos
import type { FiltersProps } from '../product-filters';
import type { ProductItemProps } from '../product-item';


// ----------------------------------------------------------------------

const GENDER_OPTIONS = [ { value: 'men', label: 'Men' }, { value: 'women', label: 'Women' }, { value: 'kids', label: 'Kids' } ];
const CATEGORY_OPTIONS = [ { value: 'all', label: 'All' }, { value: 'shose', label: 'Shose' }, { value: 'apparel', label: 'Apparel' }, { value: 'accessories', label: 'Accessories' } ];
const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
const PRICE_OPTIONS = [ { value: 'below', label: 'Below $25' }, { value: 'between', label: 'Between $25 - $75' }, { value: 'above', label: 'Above $75' } ];
const COLOR_OPTIONS = [ '#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107' ];

const defaultFilters: FiltersProps = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

// ----------------------------------------------------------------------

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) { console.error('Erro ao buscar produtos:', error); } 
      else if (data) { setProducts(data); }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleOpenFilter = useCallback(() => { setOpenFilter(true); }, []);
  const handleCloseFilter = useCallback(() => { setOpenFilter(false); }, []);
  const handleSort = useCallback((newSort: string) => { setSortBy(newSort); }, []);
  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some((key) => {
    const filterKey = key as keyof FiltersProps;
    const currentValue = filters[filterKey];
    const defaultValue = defaultFilters[filterKey];
    if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
      if (currentValue.length !== defaultValue.length) return true;
      return currentValue.some((item, index) => item !== defaultValue[index]);
    }
    return currentValue !== defaultValue;
  });

  if (loading) {
    return (
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>Produtos</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Typography>Carregando produtos...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CartIcon totalItems={8} />
      <Typography variant="h4" sx={{ mb: 5 }}>Produtos</Typography>

      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', flexWrap: 'wrap-reverse', justifyContent: 'flex-end' }}>
        <Box sx={{ my: 1, gap: 1, flexShrink: 0, display: 'flex' }}>
          <ProductFilters canReset={canReset} filters={filters} onSetFilters={handleSetFilters} openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} onResetFilter={() => setFilters(defaultFilters)} options={{ genders: GENDER_OPTIONS, categories: CATEGORY_OPTIONS, ratings: RATING_OPTIONS, price: PRICE_OPTIONS, colors: COLOR_OPTIONS }} />
          <ProductSort sortBy={sortBy} onSort={handleSort} options={[ { value: 'featured', label: 'Featured' }, { value: 'newest', label: 'Newest' }, { value: 'priceDesc', label: 'Price: High-Low' }, { value: 'priceAsc', label: 'Price: Low-High' } ]} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <Grid key={product.id_produto} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductItem 
                product={{
                  id: product.id_produto,
                  name: product.nome,
                  price: product.preco,
                  coverUrl: product.imagem,
                  priceSale: product.preco_promocional,
                  status: product.situacao,
                  colors: [], // Enviando um array vazio para cores
                }} 
              />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center', mt: 4 }}>
              Nenhum produto encontrado.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}