import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { api } from '../api/api';

const advantagesData = [
  {
    id: 1,
    title: 'Официальная гарантия',
    description: 'На все товары распространяется официальная гарантия производителя',
    icon: '📜'
  },
  {
    id: 2,
    title: 'Быстрая доставка',
    description: 'Доставляем заказы по всей России в кратчайшие сроки',
    icon: '🚚'
  },
  {
    id: 3,
    title: 'Безопасная оплата',
    description: 'Используем современные протоколы защиты платежей',
    icon: '🔒'
  },
  {
    id: 4,
    title: 'Техническая поддержка',
    description: 'Наши специалисты всегда готовы помочь с выбором или настройкой',
    icon: '🛠️'
  }
];

const HomeAdvantages = () => {
  const [brandsWithLogos, setBrandsWithLogos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await api.get('/brands?per_page=6');
        // Фильтруем бренды, у которых есть logo_url
        const brandsData = response.data.items.filter(brand => brand.logo_url);
        setBrandsWithLogos(brandsData);
      } catch (error) {
        console.error('Ошибка при загрузке брендов:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  return (
    <Box sx={{ bgcolor: '#f8f8f8', py: 6 }}>
      <Container>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
          Почему выбирают нас
        </Typography>
        
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 5 }}>
          Slice - ваш надежный партнер в мире электроники
        </Typography>
        
        <Divider sx={{ my: 5 }} />    

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {advantagesData.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Box sx={{ fontSize: 48, mb: 2 }}>
                  {item.icon}
                </Box>
                <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>        
      </Container>
    </Box>
  );
};

export default HomeAdvantages;