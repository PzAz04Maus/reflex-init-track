// @ts-ignore: Foundry VTT global types
declare const Item: any;

export class ReflexItem extends (Item as { new (...args: any[]): any }) {
  prepareDerivedData(): void {
    super.prepareDerivedData();
  }
}