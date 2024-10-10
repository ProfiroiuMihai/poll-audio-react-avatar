import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components';
import { Footer, Layout } from '@/container';

const formData = [
  {
    id: 0,
    title: 'Da, intenționez să particip și la alegeri și la referendum.',
    value: '1',
  },
  {
    id: 1,
    title: 'Da, intenționez să particip doar la alegeri.',
    value: '2',
  },
  {
    id: 2,
    title: 'Da, intenționez să particip doar la referendum.',
    value: '3',
  },
  {
    id: 3,
    title: 'Nu, nu intenționez să particip.',
    value: '4',
  },
];

interface IProps {}

const QuestionSelection: React.FC<IProps> = () => {
  const { state } = useLocation();
  console.log('🚀 ~ state:', state);
  const [selectedOption, setSelectedOption] = React.useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Layout>
      <h6 className="my-10 text-center">
        În data de 20 octombrie, intenționați să participați la vot la alegerile
        prezidențiale și la referendum?
      </h6>
      {formData?.map((item) => (
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
            text="Începe sondajul"
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
