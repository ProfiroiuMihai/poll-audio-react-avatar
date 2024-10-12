import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components';
import { Footer, Layout } from '@/container';
import { formDataRom, formDataRussian } from '@/static-data';
import { useTranslation } from 'react-i18next';

interface IProps {}

const QuestionSelection: React.FC<IProps> = () => {
  const { state } = useLocation();
  const [t, i18n] = useTranslation('global');
  const [selectedOption, setSelectedOption] = React.useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Layout>
      <h6 className="my-10 text-center">{t('choose.header')}</h6>
      {i18n.language === 'ru'
        ? formDataRussian?.map((item) => (
            <label
              key={item?.id}
              htmlFor={item?.value}
              className="my-4 block text-xs"
            >
              <input
                type="radio"
                value={item?.value}
                checked={selectedOption === item?.value}
                onChange={handleOptionChange}
                className="mx-3"
              />
              {item?.title}
            </label>
          ))
        : formDataRom?.map((item) => (
            <label
              key={item?.id}
              htmlFor={item?.value}
              className="my-4 block text-xs"
            >
              <input
                type="radio"
                value={item?.value}
                checked={selectedOption === item?.value}
                onChange={handleOptionChange}
                className="mx-3"
              />
              {item?.title}
            </label>
          ))}
      <Footer>
        <Link
          to="/question"
          className="w-full"
          state={{ userId: state?.userId, selectionId: selectedOption }}
        >
          <Button
            text={t('choose.btnText')}
            type="button"
            variant="primary"
            className="px-4 py-2"
            isValid={selectedOption !== ''}
          />
        </Link>
      </Footer>
    </Layout>
  );
};

export default React.memo(QuestionSelection);
