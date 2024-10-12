/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import * as Yup from 'yup';
import { Field, Formik, Form as FormikForm } from 'formik';
import {
  Link,
  NavigateFunction,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { IoIosPlay } from 'react-icons/io';
import { Button, DateInputMask, SearchSelect, TextField } from '@/components';
import { Footer, Layout } from '@/container';
import {
  educationLevel,
  educationLevelRussian,
  genderData,
  genderDataRussian,
} from '@/static-data';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import calculateAge from '@/utils/calculate-age';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
}

interface FormValue {
  birthdate: string;
  location: string;
  sex: Option;
  education: Option;
  checked: boolean;
}

const Form: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [t, i18n] = useTranslation('global');
  const locationParams = useLocation();
  const FORM_VALIDATION = Yup.object().shape({
    birthdate: Yup.string()
      .matches(/^\d{2}-\d{2}-\d{4}$/, t('form.placeholder.dobFormatError'))
      .required(t('form.placeholder.dobError')),
    location: Yup.string().required(t('form.placeholder.locationError')),
    sex: Yup.object()
      .shape({
        label: Yup.string().required('Sexul este necesar'),
        value: Yup.string().required('Sexul este necesar'),
      })
      .required('Sexul este necesar'),
    education: Yup.object()
      .shape({
        label: Yup.string().required('Educația este necesară'),
        value: Yup.string().required('Educația este necesară'),
      })
      .required('Educația este necesară'),
    checked: Yup.bool().oneOf(
      [true],
      'Trebuie să acceptați termenii și condițiile'
    ),
  });
  const initValues = {
    birthdate: '',
    location: '',
    sex: '',
    education: '',
    checked: false,
  };

  const saveFormValues = (values: FormValue) => {
    localStorage.setItem('formValues', JSON.stringify(values));
  };

  const loadFormValues = (): FormValue => {
    const savedValues = localStorage.getItem('formValues');
    return savedValues ? JSON.parse(savedValues) : initValues;
  };

  const clearFormValues = () => {
    localStorage.removeItem('formValues');
  };

  const handleSubmit = async (val: FormValue) => {
    const { birthdate, education, location, sex } = val;

    if (calculateAge(birthdate) < 18) {
      navigate('/age-error', { state: 'age-error' });
      return;
    }

    if (
      location === 'Domiciliul din cartea de identitate nu este in Bucuresti'
    ) {
      navigate('/age-error', { state: 'location-error' });
      return;
    }
    const { data, error } = await supabase
      .from('user')
      .insert({
        birthdate,
        location,
        education: education.value,
        sex: sex.value,
      })
      .select();
    if (data) {
      clearFormValues();
      navigate('/choose', { state: { userId: data[0]?.id } });
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
    }
  };

  React.useEffect(() => {
    if (locationParams.pathname === '/terms-conditions') {
      const savedValues = loadFormValues();
      if (savedValues) {
        saveFormValues(savedValues);
      }
    } else {
      clearFormValues();
    }
  }, [locationParams.pathname]);

  return (
    <Layout title={t('form.header')}>
      <Formik
        initialValues={loadFormValues()}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={FORM_VALIDATION}
        enableReinitialize
      >
        {({ values, isSubmitting, isValid }) => (
          <FormikForm>
            <DateInputMask
              name="birthdate"
              label={t('form.placeholder.dob')}
              isPrimary
            />
            <TextField
              name="location"
              label={t('form.placeholder.location')}
              placeholder="Ex: Chișinău"
            />

            <SearchSelect
              name="sex"
              label={t('form.placeholder.gender')}
              options={i18n.language === 'ru' ? genderDataRussian : genderData}
              placeholder={t('form.placeholder.select')}
            />
            <SearchSelect
              name="education"
              options={
                i18n.language === 'ru' ? educationLevelRussian : educationLevel
              }
              label={t('form.placeholder.education')}
              placeholder={t('form.placeholder.select')}
            />
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="checked"
                required
                className="form-checkbox-custom peer"
              />
              <label className="ml-4 text-xs" htmlFor="checked">
                {t('form.placeholder.acceptConditions')}
              </label>
            </div>
            <Link
              to="/terms-conditions"
              className="mt-5 block text-center text-sm font-normal text-[blue]"
              onClick={() => saveFormValues(values)}
            >
              {t('form.placeholder.terms')}
            </Link>

            <Footer>
              <div className="mt-4 flex items-center justify-end gap-3">
                <Link to="/" className="w-full">
                  <Button
                    text={t('form.btn.left')}
                    type="button"
                    variant="outline"
                    className="px-4 py-2"
                  />
                </Link>

                <Button
                  text={t('form.btn.right')}
                  type="submit"
                  variant="primary"
                  icon={<IoIosPlay size={20} color="#fff" />}
                  className="px-4 py-2"
                  hasIcon
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />
              </div>
            </Footer>
          </FormikForm>
        )}
      </Formik>
    </Layout>
  );
};

export default React.memo(Form);
