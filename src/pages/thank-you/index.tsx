import React from 'react';
import { Message, MetaPixel } from '@/components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ThankYouPage = () => {
  const [t] = useTranslation('global');
  return (
    <>
      <div className="">
        <Message
          message={t('congratulation.subTitle')}
          title={t('congratulation.title')}
          imageUrl="/clap.png"
        />

        <Link
          to="/terms-conditions"
          className="block pb-10 text-center text-sm font-normal text-[blue]"
        >
          {t('terms-and-conditions.termsTitle')}
        </Link>
      </div>
      <MetaPixel />
    </>
  );
};

export default React.memo(ThankYouPage);
