import * as React from 'react';
import { Button, VideoPlayer, VideoSkeleton } from '@/components';
import { Footer, Layout } from '@/container';
import { Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { useTranslation } from 'react-i18next';

const lanaguageOptions = [
  {
    id: 0,
    title: 'Romanian',
    imageUrl: '/romania.png',
    value: 'ro',
  },
  {
    id: 1,
    title: 'Russian',
    imageUrl: '/russia.webp',
    value: 'ru',
  },
];

const Home: React.FC = () => {
  const [isSelectedLanguage, setIsSelectedLanguage] = React.useState(false);
  const [langSelected, setLangSelected] = React.useState('');
  const { data: introData, isLoading } = useFetch('polls');
  const [t, i18n] = useTranslation('global');

  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleContinue = () => {
    setIsSelectedLanguage(!isSelectedLanguage);
    i18n.changeLanguage(langSelected);
  };

  return isSelectedLanguage ? (
    <>
      <Layout>
        <h6 className="mb-4 mt-5 text-center text-[22px] font-bold">
          {isPlaying ? t('home.subHeader') : t('home.header')}
        </h6>

        {isLoading ? (
          <VideoSkeleton />
        ) : (
          <VideoPlayer
            url={(introData && introData[0]?.demo_video) ?? ''}
            setIsPlaying={setIsPlaying}
          />
        )}
      </Layout>
      <Footer>
        <h6 className="text-center font-bold">
          <Link to="/form" className="w-full">
            <Button
              text={t('home.btnText')}
              type="submit"
              variant="primary"
              className="px-4 py-2"
            />
          </Link>
        </h6>
      </Footer>
    </>
  ) : (
    <Layout>
      <h4 className="my-20 text-center text-2xl font-black text-primary">
        Choose Language
      </h4>
      <div className="flex items-center justify-evenly gap-10">
        {lanaguageOptions?.map((item) => (
          <div
            className={`${langSelected === item?.value ? 'bg-violet font-semibold text-white' : 'bg-none'} rounded-md p-5`}
            key={item?.id}
            onClick={() => setLangSelected(item?.value)}
            role="button"
            aria-hidden
          >
            <img
              src={item?.imageUrl}
              alt="choose language "
              className="mx-auto h-10 w-16 object-contain"
            />
            <p className="mt-5 text-center text-sm">{item?.title}</p>
          </div>
        ))}
      </div>
      <Button
        text="Continue"
        type="button"
        variant="primary"
        isValid={langSelected !== ''}
        className="mt-10"
        onClick={handleContinue}
      />
    </Layout>
  );
};

export default React.memo(Home);
