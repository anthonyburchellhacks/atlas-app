import { getNextStaticProps, is404 } from '@faustjs/next';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { client } from 'client';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
  ThreeObjectFront,
} from 'components';
import { pageTitle } from 'utils';

export function PageComponent({ page }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const threeApp = typeof document !== 'undefined' && document.querySelector( '.three-object-three-app' );
  const [ threeUrl, setThreeUrl ] = useState();
  const [ deviceTarget, setDeviceTarget ] = useState();
  const [ backgroundColor, setBackgroundColor ] = useState();
  const [ zoom, setZoom ] = useState();
  const [ scale, setScale ] = useState();
  const [ hasZoom, setHasZoom ] = useState();
  const [ hasTip, setHasTip ] = useState();
  const [ positionY, setPositionY ] = useState();
  const [ rotationY, setRotationY ] = useState();
  const [ animations, setAnimations ] = useState();
  
  useEffect(() => {
      setThreeUrl(
        threeApp.querySelector('p.three-object-block-url')
          ? threeApp.querySelector('p.three-object-block-url').innerText
          : ''
      );

      setDeviceTarget(
        threeApp.querySelector('p.three-object-block-device-target')
          ? threeApp.querySelector('p.three-object-block-device-target')
              .innerText
          : '2D'
      );

      setBackgroundColor(
        threeApp.querySelector('p.three-object-background-color')
          ? threeApp.querySelector('p.three-object-background-color').innerText
          : '#ffffff'
      );

      setZoom(
        threeApp.querySelector('p.three-object-zoom')
          ? threeApp.querySelector('p.three-object-zoom').innerText
          : 90
      );

      setScale(
        threeApp.querySelector('p.three-object-scale')
          ? threeApp.querySelector('p.three-object-scale').innerText
          : 1
      );

      setHasZoom(
        threeApp.querySelector('p.three-object-has-zoom')
          ? threeApp.querySelector('p.three-object-has-zoom').innerText
          : false
      );

      setHasTip(
        threeApp.querySelector('p.three-object-has-tip')
          ? threeApp.querySelector('p.three-object-has-tip').innerText
          : true
      );

      setPositionY(
        threeApp.querySelector('p.three-object-position-y')
          ? threeApp.querySelector('p.three-object-position-y').innerText
          : 0
      );

      setRotationY(
        threeApp.querySelector('p.three-object-rotation-y')
          ? threeApp.querySelector('p.three-object-rotation-y').innerText
          : 0
      );

      setAnimations(
        threeApp.querySelector('p.three-object-animations')
          ? threeApp.querySelector('p.three-object-animations').innerText
          : ''
      );
  }, [threeApp]);

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          page?.title(),
          generalSettings?.title
        )}
        imageUrl={page?.featuredImage?.node?.sourceUrl?.()}
      />

      {/* <Header /> */}
      <Main>
        {/* <EntryHeader title={page?.title()} image={page?.featuredImage?.node} /> */}
        <div className="container">
          {threeUrl &&
            <ThreeObjectFront
              threeUrl={ threeUrl }
              deviceTarget={ deviceTarget }
              zoom={ zoom }
              scale={ scale }
              hasTip={ hasTip }
              hasZoom={ hasZoom }
              positionY={ positionY }
              rotationY={ rotationY }
              animations={ animations }
              backgroundColor={ backgroundColor }
            />        
          }
          <ContentWrapper content={page?.content()} />
        </div>
      </Main>

      {/* <Footer /> */}
    </>
  );
}

export default function Page() {
  const { usePage } = client;
  const page = usePage();

  return <PageComponent page={page} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    notFound: await is404(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
