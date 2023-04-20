const line = require('@line/bot-sdk');
require('dotenv').config();
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
const { getProducts, getHotProducts } = require('../models/product_model');
// const RichMenuImageURL = 'public/images/richmenu_template.png';
const RichMenuImageURL = 'public/images/richmenu_icon.png';
const STYLISH_imageURL =
    'https://images.unsplash.com/photo-1585914924626-15adac1e6402?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80';
const client = new line.Client(config);
const richMenuButtonTexts = ['顯示熱門商品', '男裝推薦', '聯絡商家', '女裝推薦', '配件推薦', '前往官網'];
const websiteURL = process.env.PUBLIC_URL;

setUpDefaultRichMenu();
// broadCastTest(client);
/**
 * * Replay Event handler
 * @param {*} event
 * @returns
 */
async function handleMessageEvent(event) {
    console.log('Client message:', event.message.text);
    console.log('Client id', event.source.userId);

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    let customReplyMessage = '';
    let product = null;
    let hotProduct = null;
    let mainImageUrl = null;
    let buttonUrl = null;
    switch (event.message.text) {
        case richMenuButtonTexts[0]:
            hotProduct = await getSingleHotProduct();
            mainImageUrl = checkAndMakeImageUrl(hotProduct);
            buttonUrl = makeImageButtonUrlById(hotProduct.id);
            customReplyMessage = customReplyMessage = [
                { type: 'text', text: '推薦你一個熱門商品' },
                { type: 'text', text: `product ID${hotProduct.id}` },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${mainImageUrl}`,
                        text: `${hotProduct.title}`,
                        actions: [
                            {
                                type: 'uri',
                                label: '來去看看',
                                uri: `${buttonUrl}`,
                            },
                        ],
                    },
                },
            ];
            break;
        case richMenuButtonTexts[1]:
            product = await getSingleProductInfo('men');
            mainImageUrl = checkAndMakeImageUrl(product);
            buttonUrl = makeImageButtonUrlById(product.id);
            customReplyMessage = [
                { type: 'text', text: '推薦你一件男裝' },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${mainImageUrl}`,
                        text: `${product.title}`,
                        actions: [
                            {
                                type: 'uri',
                                label: '來去看看',
                                uri: `${buttonUrl}`,
                            },
                        ],
                    },
                },
            ];

            break;
        case richMenuButtonTexts[2]:
            customReplyMessage = [
                { type: 'text', text: `透過我們的網站與客服聊聊: ${websiteURL}` },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${STYLISH_imageURL}`,
                        text: 'STYLISH',
                        actions: [
                            {
                                type: 'uri',
                                label: '與我們聊聊',
                                uri: `${websiteURL}`,
                            },
                        ],
                    },
                },
                // { type: 'uri', label: '前往STYLISH網站', uri: `${websiteURL}` },
            ];
            break;
        case richMenuButtonTexts[3]:
            product = await getSingleProductInfo('women');
            mainImageUrl = checkAndMakeImageUrl(product);
            buttonUrl = makeImageButtonUrlById(product.id);
            customReplyMessage = [
                { type: 'text', text: '推薦你一件女裝' },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${mainImageUrl}`,
                        text: `${product.title}`,
                        actions: [
                            {
                                type: 'uri',
                                label: '來去看看',
                                uri: `${buttonUrl}`,
                            },
                        ],
                    },
                },
            ];
            break;
        case richMenuButtonTexts[4]:
            product = await getSingleProductInfo('accessories');
            mainImageUrl = checkAndMakeImageUrl(product);
            buttonUrl = makeImageButtonUrlById(product.id);
            console.log('🚀 ~ file: linebot_controller.js:110 ~ handleMessageEvent ~ buttonUrl:', buttonUrl);
            customReplyMessage = [
                { type: 'text', text: '推薦您一個配件' },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${mainImageUrl}`,
                        text: `${product.title}`,
                        actions: [
                            {
                                type: 'uri',
                                label: '來去看看',
                                uri: `${buttonUrl}`,
                            },
                        ],
                    },
                },
            ];
            break;

        case richMenuButtonTexts[5]:
            customReplyMessage = customReplyMessage = [
                { type: 'text', text: `前往STYLISH網站: ${websiteURL}` },
                {
                    type: 'template',
                    altText: 'This is a buttons template',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: `${STYLISH_imageURL}`,
                        text: 'STYLISH',
                        actions: [
                            {
                                type: 'uri',
                                label: '前往網站',
                                uri: `${websiteURL}`,
                            },
                        ],
                    },
                },
                // { type: 'uri', label: '前往STYLISH網站', uri: `${websiteURL}` },
            ];
            break;
        default:
            customReplyMessage = [
                { type: 'text', text: '此帳號為自動回覆的Line Bot，若你想要與我們聊聊，可以點選下方聯絡商家按鈕。' },
                {
                    type: 'text',
                    text: `若你是使用電腦版的Line，可以輸入以下文字來使用手機板上的按鈕功能\n1. ${richMenuButtonTexts[0]}\n2. ${richMenuButtonTexts[1]}\n3. ${richMenuButtonTexts[2]}\n4. ${richMenuButtonTexts[3]}\n5. ${richMenuButtonTexts[4]}\n6. ${richMenuButtonTexts[5]}`,
                },
            ];
    }

    //! 回覆訊息給使用者(針對單一replyToken)
    // return client.replyMessage(event.replyToken, [
    //text
    // {
    //     type: 'text',
    //     text: customReplyMessage,
    // },
    //sticker
    // { type: 'sticker', packageId: '446', stickerId: '1998' },
    // ]);
    return client.replyMessage(event.replyToken, customReplyMessage);
}

/**
 * * 設定預設RichMenu
 */
function setUpDefaultRichMenu() {
    client.deleteDefaultRichMenu().then(() => {
        console.log('delete default rich menu success');
    });
    // client.getDefaultRichMenuId().then((richMenuId) => {
    //     console.log(`get current richMenuId: ${richMenuId}`);
    // });
    const richMenu = {
        size: {
            width: 2500,
            height: 1686,
        },
        selected: true,
        name: 'My Rich Menu',
        chatBarText: 'Tap here',
        areas: [
            {
                bounds: {
                    x: 0,
                    y: 0,
                    width: 833,
                    height: 843,
                },
                action: {
                    type: 'message',
                    label: 'Button 1',
                    text: `${richMenuButtonTexts[0]}`,
                },
            },
            {
                bounds: {
                    x: 833,
                    y: 0,
                    width: 833,
                    height: 843,
                },
                action: {
                    type: 'message',
                    label: 'Button 2',
                    text: `${richMenuButtonTexts[1]}`,
                },
            },
            {
                bounds: {
                    x: 1666,
                    y: 0,
                    width: 833,
                    height: 843,
                },
                action: {
                    type: 'message',
                    label: 'Button 3',
                    text: `${richMenuButtonTexts[2]}`,
                },
            },
            {
                bounds: {
                    x: 0,
                    y: 843,
                    width: 833,
                    height: 843,
                },
                action: {
                    type: 'message',
                    label: 'Button 1',
                    text: `${richMenuButtonTexts[3]}`,
                },
            },
            {
                bounds: {
                    x: 833,
                    y: 843,
                    width: 833,
                    height: 843,
                },
                action: {
                    type: 'message',
                    label: 'Button 2',
                    text: `${richMenuButtonTexts[4]}`,
                },
            },
            {
                bounds: {
                    x: 1666,
                    y: 843,
                    width: 833,
                    height: 843,
                },
                // action: {
                //     type: 'message',
                //     label: 'Button 3',
                //     text: `${richMenuButtonTexts[5]}`,
                // },
                action: {
                    type: 'uri',
                    uri: `${websiteURL}`,
                },
            },
        ],
    };

    // create rich menu
    client
        .createRichMenu(richMenu)
        .then((richMenuId) => {
            console.log(`Rich menu created. ID: ${richMenuId}`);

            // upload image for rich menu
            const fs = require('fs');
            const path = require('path');
            // const imagePath = path.join(__dirname, "avatar.jpg");
            const imagePath = path.join(RichMenuImageURL);
            console.log(imagePath);
            const stream = fs.createReadStream(imagePath);
            client
                .setRichMenuImage(richMenuId, stream)
                .then(() => {
                    console.log('Rich menu image uploaded.');

                    // set default rich menu
                    client
                        .setDefaultRichMenu(richMenuId)
                        .then(() => {
                            console.log('Default rich menu set.');
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error('error:', err);
                });
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * * 取得單一商品資訊(用於reply message)
 * @param {*} category
 * @returns
 */
async function getSingleProductInfo(category) {
    const product = await getProducts(1000, 0, { category: `${category}` }).then((result) => {
        // console.log('result.length: ', result.products.length);

        // return result.products[0];
        const randomIndex = Math.floor(Math.random() * result.products.length);
        console.log('🚀 ~ file: linebot_controller.js:354 ~ product ~ randomIndex:', randomIndex);
        console.log(result.products[randomIndex]);
        return result.products[randomIndex];
    });
    console.log(`product: ${product}`);
    return product;
}

/**
 * * 取得單一熱門商品資訊(隨機)(用於reply message)
 * @returns{hotProduct}
 */
async function getSingleHotProduct() {
    const hotProduct = await getHotProducts(1).then((result) => {
        const randomIndex = Math.floor(Math.random() * result.length);
        console.log(result[randomIndex]);
        return result[randomIndex];
    });
    console.log(`hotProduct: ${hotProduct}`);
    return hotProduct;
}

/**
 * * 檢查Product的圖片網址是否為公開網址，若不是則使用本地圖片
 * @param {*} Product
 * @returns{string}
 */
function checkAndMakeImageUrl(product) {
    const { main_image, id } = product;
    if (main_image.startsWith('http')) {
        return main_image;
    }
    // return 'https://images.unsplash.com/photo-1480497490787-505ec076689f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80';
    //! 回覆本地圖片網址
    return `${websiteURL}/assets/${id}/${main_image}`;
}

/**
 * * 產生商品圖片按鈕(Line Template)網址
 * @param {Number} productId
 * @returns{String} product page URL
 */
function makeImageButtonUrlById(productId) {
    console.log(`productId: ${productId}`);
    return `${websiteURL}/product.html?id=${productId}`;
}

// function broadCastTest(client) {
//     const message = {
//         type: 'text',
//         text: 'broadcast hello world',
//     };
//     client
//         .broadcast(message)
//         .then(() => {
//             console.log('Broadcast sent successfully!');
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }

// function getProfileTest(userId) {
//     client
//         .getProfile(userId)
//         .then((profile) => {
//             console.log(profile);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }

module.exports = {
    handleMessageEvent,
    setUpDefaultRichMenu,
    config,
};
