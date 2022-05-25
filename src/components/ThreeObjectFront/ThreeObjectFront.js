import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
	OrthographicCamera,
	OrbitControls,
	useAnimations,
	Box,
  Text
} from '@react-three/drei';
import { GLTFAudioEmitterExtension } from 'three-omi';
import {
	VRCanvas,
	ARCanvas,
	DefaultXRControllers,
	Hands,
} from '@react-three/xr';
import { Controls, TeleportTravel } from 'components';

function SavedObject( props ) {
	const [ url, set ] = useState( props.url );
	const [ productPositions, setProductPositions ] = useState([]);

	useEffect( () => {
		setTimeout( () => set( props.url ), 2000 );
	}, [] );
	const [ listener ] = useState( () => new THREE.AudioListener() );

	useThree( ( { camera } ) => {
		camera.add( listener );
	} );

	const { scene, animations } = useLoader( GLTFLoader, url, ( loader ) => {
		loader.register(
			( parser ) => new GLTFAudioEmitterExtension( parser, listener )
		);
	} );

	const { actions } = useAnimations( animations, scene );
	const sceneObjects = scene.children;

	const animationList = props.animations ? props.animations.split( ',' ) : '';
	const gltf = useLoader(GLTFLoader, 'https://bpatlasapp.wpengine.com/wp-content/uploads/2022/05/mothcryptyd-1-1.vrm');

	useEffect( () => {

		sceneObjects.forEach( ( child ) => {
			if(child.userData.gltfExtensions && child.userData.gltfExtensions.MOZ_hubs_components['media-frame']) {
				var products = productPositions;
				products.push(child);
				setProductPositions(products);
			}
		});
		console.log(productPositions);

		if ( animationList ) {
			animationList.forEach( ( name ) => {
				
				if ( Object.keys( actions ).includes( name ) ) {
					actions[ name ].play();
				}
			} );
		}

		productPositions.forEach( ( child ) => {
			var addScene = gltf.scene.clone(true);
			console.log(addScene);
			addScene.position.set(child.position.x, child.position.y, child.position.z );
			addScene.rotation.set(child.rotation.x, gltf.scene.rotation.y - child.rotation.y, child.rotation.z );
			// addScene.rotation.set(0, 180, 0 );
			addScene.scale.set(5,5,5)
			scene.add(addScene);
		});
	
	}, [] );

	scene.position.set( 0, props.positionY, 0 );
	scene.rotation.set( 0, props.rotationY, 0 );
	scene.scale.set( props.scale, props.scale, props.scale );
	//pick up here. scene.add(thingsssssssss)
	// productPositions.forEach( ( child ) => {
	// 	const gltf = useLoader(GLTFLoader, 'https://bpatlasapp.wpengine.com/wp-content/uploads/2022/05/mothcryptyd-1-1.vrm');
	// });

	return (
		<>
			<primitive object={ scene } />
		</>
  )
}

function Floor( props ) {
	return (
		<mesh rotation={ [ -Math.PI / 2, 0, 0 ] } { ...props }>
			<planeBufferGeometry args={ [ 1000, 1000 ] } attach="geometry" />
			<meshBasicMaterial
				opacity={ 0 }
				transparent={ true }
				attach="material"
			/>
		</mesh>
	);
}

export default function ThreeObjectFront( props ) {
	if ( props.deviceTarget === 'vr' ) {
		return (
			<>
				<VRCanvas
          camera={ { fov: 80, zoom: props.zoom, position: [ 0, 0, 20 ] } }
					style={ {
						backgroundColor: props.backgroundColor,
						margin: '0 Auto',
						height: '500px',
						width: '90%',
					} }
				>
					<TeleportTravel useNormal={ true }>
						<Floor rotation={ [ -Math.PI / 2, 0, 0 ] } />
					</TeleportTravel>
					<Hands />
					<DefaultXRControllers />
					<ambientLight intensity={ 0.5 } />
					<directionalLight
						intensity={ 0.6 }
						position={ [ 0, 2, 2 ] }
						shadow-mapSize-width={ 2048 }
						shadow-mapSize-height={ 2048 }
						castShadow
					/>
					<Suspense fallback={ null }>
						{ props.threeUrl && (
							<SavedObject
								positionY={ props.positionY }
								rotationY={ props.rotationY }
								url={ props.threeUrl }
								color={ props.backgroundColor }
								hasZoom={ props.hasZoom }
								scale={ props.scale }
								hasTip={ props.hasTip }
								animations={ props.animations }
							/>
						) }
					</Suspense>
					<OrbitControls
						enableZoom={ props.hasZoom === '1' ? true : false }
					/>
				</VRCanvas>
				{ props.hasTip === '1' ? (
					<p className="three-object-block-tip">Click and drag ^</p>
				) : (
					<p></p>
				) }
			</>
		);
	}
	if ( props.deviceTarget === 'ar' ) {
		return (
			<>
				<ARCanvas
          camera={ { fov: 80, zoom: props.zoom, position: [ 0, 0, 20 ] } }
					style={ {
						backgroundColor: props.backgroundColor,
						margin: '0 Auto',
						height: '500px',
						width: '90%',
					} }
				>
					<ambientLight intensity={ 0.5 } />
					<directionalLight
						intensity={ 0.6 }
						position={ [ 0, 2, 2 ] }
						shadow-mapSize-width={ 2048 }
						shadow-mapSize-height={ 2048 }
						castShadow
					/>
					<Suspense fallback={ null }>
						{ props.threeUrl && (
							<SavedObject
								positionY={ props.positionY }
								rotationY={ props.rotationY }
								url={ props.threeUrl }
								color={ props.backgroundColor }
								hasZoom={ props.hasZoom }
								scale={ props.scale }
								hasTip={ props.hasTip }
								animations={ props.animations }
							/>
						) }
					</Suspense>
					<OrbitControls
						enableZoom={ props.hasZoom === '1' ? true : false }
					/>
				</ARCanvas>
				{ props.hasTip === '1' ? (
					<p className="three-object-block-tip">Click and drag ^</p>
				) : (
					<p></p>
				) }
			</>
		);
	}
	if ( props.deviceTarget === '2d' ) {
		return (
			<>
				<Canvas
          camera={ { fov: 80 } }
					style={ {
						backgroundColor: props.backgroundColor,
						margin: '0 Auto',
						height: '500px',
						width: '90%',
					} }
				>
					<OrthographicCamera near={0} makeDefault position={[0, 0, 20]} zoom={props.zoom} /> :
					<ambientLight intensity={ 0.5 } />
					<directionalLight
						intensity={ 0.6 }
						position={ [ 0, 2, 2 ] }
						shadow-mapSize-width={ 2048 }
						shadow-mapSize-height={ 2048 }
						castShadow
					/>
					<Suspense fallback={ null }>
						{ props.threeUrl && (
							<SavedObject
								positionY={ props.positionY }
								rotationY={ props.rotationY }
								url={ props.threeUrl }
								color={ props.backgroundColor }
								hasZoom={ props.hasZoom }
								scale={ props.scale }
								hasTip={ props.hasTip }
								animations={ props.animations }
							/>
						) }
					</Suspense>
					<OrbitControls
						enableZoom={ props.hasZoom === '1' ? true : false }
					/>
				</Canvas>
				{ props.hasTip === '1' ? (
					<p className="three-object-block-tip">Click and drag ^</p>
				) : (
					<p></p>
				) }
			</>
		);
	}
	if ( props.deviceTarget === 'playerController' ) {
		return (
			<>
				<Canvas
					camera={ { fov: 80, zoom: props.zoom, position: [ 0, 0, 20 ] } }
					style={ {
						backgroundColor: props.backgroundColor,
						margin: '0 0',
						height: '100vh',
						width: '100vw',
					} }
				>
					{/* {favorites && favorites["favoriteLinks"].map((itemUrl, index) => { 
						const positionX = (index * 3) - 8;
						const splitPosition = favorites["linkPosition"][index].split(',');
						const splitRotation = favorites["linkRotation"][index].split(',');
						const splitText = favorites["linkText"];
						return (<InteractiveButton url={itemUrl} useNormal={true}>
						<Box rotation={splitRotation} position={[splitPosition[0], splitPosition[1], splitPosition[2] - 0.1]} scale={[2, .8, .1]}>
							<meshStandardMaterial attach="material" color="#7e00fb" />
						</Box>
						<Text
							scale={[2, 2, 2]}
							color="white" // default
							anchorX="center" // default
							anchorY="middle" // default
							// position={[positionX, 2, -20]}
							position={splitPosition}
							rotation={splitRotation}
						>
							{splitText[index]}
						</Text>
						</InteractiveButton>)
					})} */}
					<ambientLight intensity={ 0.5 } />
					<directionalLight
						intensity={ 0.6 }
						position={ [ 0, 2, 2 ] }
						shadow-mapSize-width={ 2048 }
						shadow-mapSize-height={ 2048 }
						castShadow
					/>
					<Suspense fallback={ null }>
						<Controls />
						{ props.threeUrl && (
							<SavedObject
								positionY={ props.positionY }
								rotationY={ props.rotationY }
								url={ props.threeUrl }
								color={ props.backgroundColor }
								hasZoom={ props.hasZoom }
								scale={ props.scale }
								hasTip={ props.hasTip }
								animations={ props.animations }
							/>
						) }
					</Suspense>
				</Canvas>
				{ props.hasTip === '1' ? (
					<p className="three-object-block-tip">Click and drag ^</p>
				) : (
					<p></p>
				) }
			</>
		);
	}	
}
