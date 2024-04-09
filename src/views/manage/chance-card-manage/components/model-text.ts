// @ts-ignore
interface PropertyInterface {
    //房产信息
    getId: () => string;
    getName: () => string;
    getBuildingLevel: () => number;
    getBuildCost: () => number;
    getSellCost: () => number;
    getCost_lv0: () => number;
    getCost_lv1: () => number;
    getCost_lv2: () => number;
    getOwner: () => { id: string; name: string; color: string; avatar: string } | undefined;
    getPassCost: () => number;

    //设置房产信息
    setOwner: (player: PlayerInterface) => void;
    buildUp: () => void;
}

interface User {
    userId: string;
    username: string;
    socketClient: WebSocket;
    avatar: string;
    color: string;
}

interface PlayerInterface {
    //玩家信息
    getUser: () => User;
    getId: () => string;
    getName: () => string;

    //地产相关
    getPropertiesList: () => PropertyInterface[];
    setPropertiesList: (newPropertiesList: PropertyInterface[]) => void;
    gainProperty: (property: PropertyInterface) => void;
    loseProperty: (propertyId: string) => void;

    //机会卡相关
    getCardsList: () => ChanceCardInterface[];
    setCardsList: (newChanceCardList: ChanceCardInterface[]) => void;
    getCardById: (cardId: string) => ChanceCardInterface | undefined;
    gainCard: (card: ChanceCardInterface) => void;
    loseCard: (cardId: string) => void;

    //钱相关
    setMoney: (money: number) => void;
    getMoney: () => number;
    cost: (money: number) => boolean;
    gain: (money: number) => number;

    //游戏相关
    setStop: (stop: number) => void;
    getStop: () => number;
    setPositionIndex: (newIndex: number) => void;
    getPositionIndex: () => number;
}

enum ChanceCardType {
    ToSelf = "ToSelf",
    ToOtherPlayer = "ToOtherPlayer",
    ToProperty = "ToProperty",
    ToMapItem = "ToMapItem",
}

interface ChanceCardInterface {
    getId: () => string;
    getName: () => string;
    getDescribe: () => string;
    getIcon: () => string;
    getType: () => ChanceCardType;
    getColor: () => string;
    getEffectCode: () => string;
    use: (sourcePlayer: PlayerInterface, target: PlayerInterface | PropertyInterface | PlayerInterface[] | PropertyInterface[]) => void;
}

function effectFunction(sourcePlayer: PlayerInterface, target: PlayerInterface | PropertyInterface | PlayerInterface[] | PropertyInterface[]){
    //CODING AREA

    //CODING AREA
}