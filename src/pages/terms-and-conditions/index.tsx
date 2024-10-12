import { Layout } from '@/container';
import {
  privacyPolicyData,
  privacyPolicyDataRussian,
  termsAndConditionsData,
  termsAndConditionsDataRussian,
} from '@/static-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsAndCondition: React.FC = () => {
  const [t, i18n] = useTranslation('global');
  return (
    <Layout>
      <div className="py-5">
        <h4 className="mb-10 text-center text-xl font-semibold text-primary">
          {t('form.placeholder.terms')}
        </h4>
        {i18n.language === 'ru'
          ? termsAndConditionsDataRussian?.map((item) => (
              <div className="my-5" key={item?.id}>
                <h6 className="text-sm font-semibold">
                  <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
                </h6>
                <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
              </div>
            ))
          : termsAndConditionsData?.map((item) => (
              <div className="my-5" key={item?.id}>
                <h6 className="text-sm font-semibold">
                  <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
                </h6>
                <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
              </div>
            ))}
        <p className="mx-4 pb-10 text-sm">
          {t('terms-and-conditions.termBottomTitle')}
        </p>
        {/* <div classNam e="border border-t border-[#00000049]" /> */}
        <h4 className="mb-10 text-center text-xl font-semibold text-primary">
          {t('terms-and-conditions.privacyTitle')}
        </h4>
        {i18n.language === 'ru'
          ? privacyPolicyDataRussian?.map((item) => (
              <div className="my-5" key={item?.id}>
                <h6 className="text-sm font-semibold">
                  <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
                </h6>
                <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
              </div>
            ))
          : privacyPolicyData?.map((item) => (
              <div className="my-5" key={item?.id}>
                <h6 className="text-sm font-semibold">
                  <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
                </h6>
                <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
              </div>
            ))}
        <p className="mx-4 text-justify text-sm">
          {t('terms-and-conditions.bottomText')}
        </p>
      </div>
    </Layout>
  );
};

export default React.memo(TermsAndCondition);
