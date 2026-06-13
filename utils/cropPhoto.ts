import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

/**
 * Recorta a foto capturada para a mesma proporção do preview da câmera
 * (tela cheia), centralizado.
 *
 * O preview do `CameraView` usa recorte "cover" (preenche a tela e corta as
 * bordas), enquanto `takePictureAsync` devolve o frame inteiro do sensor — com
 * FOV maior, por isso a foto sai "mais aberta" que o enquadrado. Igualar a
 * proporção faz a foto salva corresponder ao que o usuário viu no guia.
 *
 * Em qualquer falha (ou dados ausentes), devolve a URI original sem recortar.
 */
export async function cropToPreviewAspect(
  uri: string,
  photoWidth: number | undefined,
  photoHeight: number | undefined,
  previewWidth: number,
  previewHeight: number,
): Promise<string> {
  if (!photoWidth || !photoHeight || !previewWidth || !previewHeight) return uri;

  // Proporção-alvo expressa na mesma orientação da foto crua.
  const photoPortrait = photoHeight >= photoWidth;
  const previewPortrait = previewHeight >= previewWidth;
  const targetRatio =
    photoPortrait === previewPortrait
      ? previewWidth / previewHeight
      : previewHeight / previewWidth;

  let cropWidth = photoWidth;
  let cropHeight = Math.round(photoWidth / targetRatio);
  if (cropHeight > photoHeight) {
    cropHeight = photoHeight;
    cropWidth = Math.round(photoHeight * targetRatio);
  }

  const originX = Math.max(0, Math.round((photoWidth - cropWidth) / 2));
  const originY = Math.max(0, Math.round((photoHeight - cropHeight) / 2));

  try {
    const image = await ImageManipulator.manipulate(uri)
      .crop({ originX, originY, width: cropWidth, height: cropHeight })
      .renderAsync();
    const result = await image.saveAsync({ compress: 0.8, format: SaveFormat.JPEG });
    return result.uri;
  } catch {
    return uri;
  }
}

/**
 * Aplica um recorte manual (definido pelo usuário em `CropOverlay`) à foto
 * capturada. Em qualquer falha, devolve a URI original sem recortar.
 */
export async function cropToRect(uri: string, rect: CropRect): Promise<string> {
  try {
    const image = await ImageManipulator.manipulate(uri).crop(rect).renderAsync();
    const result = await image.saveAsync({ compress: 0.8, format: SaveFormat.JPEG });
    return result.uri;
  } catch {
    return uri;
  }
}
