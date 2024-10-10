/* eslint-disable @typescript-eslint/no-misused-promises */
import * as React from 'react';
import { Button, VideoPlayer, VideoSkeleton } from '@/components';
import { Footer, Layout } from '@/container';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

const Home: React.FC = () => {
  const { data: introData, isLoading } = useFetch('polls');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('user')
      .insert({
        birthdate: '',
        location: '',
        education: '',
        sex: '',
      })
      .select();
    if (data) {
      setIsSubmitting(false);
      navigate('/question', { state: { userId: data[0]?.id } });
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Layout>
        <h6 className="mb-4 mt-5 text-center text-[22px] font-bold">
          {isPlaying ? 'Instrucțiuni' : 'Bun venit!'}
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
          <Button
            text="Începe sondajul"
            type="submit"
            variant="primary"
            className="w-full px-4 py-2"
            onClick={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </h6>
      </Footer>
    </>
  );
};

export default React.memo(Home);
