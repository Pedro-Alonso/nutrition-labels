import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

/**
 * Aplica um recorte manual (definido pelo usuário em `CropOverlay`) à foto
 * capturada. Em qualquer falha, devolve a URI original sem recortar.
 */
export async function cropToRect(uri: string, rect: CropRect): Promise<string> {
  try {
    const image = await ImageManipulator.manipulate(uri).crop(rect).renderAsync();
    const result = await image.saveAsync({ compress: 0.9, format: SaveFormat.JPEG });
    return result.uri;
  } catch {
    return uri;
  }
}
