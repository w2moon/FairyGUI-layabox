///<reference path="GearBase.ts"/>

namespace fgui {
    interface Value {
        playing?: boolean;
        frame?: number;
        animationName?:string;
        skinName?:string;
    }

    export class GearAnimation extends GearBase {
        private _storage: { [index: string]: Value };
        private _default: Value;

        constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = {
                playing: this._owner.getProp(ObjectPropID.Playing),
                frame: this._owner.getProp(ObjectPropID.Frame),
                animationName:'',
            };
            this._storage = {};
        }

        private getPageConfig(pageId:string){
            const gswl = this._owner.gswl;
            if(!gswl || !gswl.controllers){
                return;
            }
            const controller = gswl.controllers[this._controller.name];
            if(!controller || !controller.pages){
                return;
            }
            return controller.pages[this._controller.getPageNameById(pageId as any)];
           
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: Value;
            if (pageId == null)
                gv = this._default;
            else
                this._storage[pageId] = gv = {};
            gv.playing = buffer.readBool();
            gv.frame = buffer.getInt32();

            const page = this.getPageConfig(pageId);
            if(page){
                gv.animationName = page.animationName;
                gv.skinName = page.skinName;
            }
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            this._owner.setProp(ObjectPropID.Playing, gv.playing);
            this._owner.setProp(ObjectPropID.Frame, gv.frame);
            this._owner.setProp(ObjectPropID.AnimationName, gv.animationName);
            this._owner.setProp(ObjectPropID.SkinName, gv.skinName);

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                this._storage[this._controller.selectedPageId] = gv = {};

            gv.playing = this._owner.getProp(ObjectPropID.Playing);
            gv.frame = this._owner.getProp(ObjectPropID.Frame);

            const page = this.getPageConfig(this._controller.selectedPageId);
            if(page){
                gv.animationName = page.animationName;
                gv.skinName = page.skinName;
            }
            
          
        }
    }
}