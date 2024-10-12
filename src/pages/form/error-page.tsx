import { Message } from '@/components';
import { Layout } from '@/container';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const FormErrorPage: React.FC = () => {
  const { state } = useLocation();
  const [t] = useTranslation('global');
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!state) {
      navigate('/form');
    }
  }, [navigate, state]);
  return (
    <Layout>
      <Message
        imageUrl={state === 'age-error' ? '/card.png' : '/location.png'}
        message={
          state === 'age-error'
            ? t('errorPage')
            : 'Pentru a participa la acest sondaj, este necesar ca domiciliul dumneavoastră să fie în București.'
        }
      />
    </Layout>
  );
};

export default React.memo(FormErrorPage);
