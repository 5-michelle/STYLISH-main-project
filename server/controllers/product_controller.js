const _ = require('lodash');
const util = require('../../util/util');
const Product = require('../models/product_model');
const pageSize = 6;
const reader = require('xlsx');

const createProduct = async (req, res) => {
    const body = req.body;
    const product = {
        id: body.product_id,
        category: body.category,
        title: body.title,
        description: body.description,
        price: body.price,
        texture: body.texture,
        wash: body.wash,
        place: body.place,
        note: body.note,
        story: body.story,
    };
    product.main_image = req.files.main_image[0].filename;
    const colorIds = body.color_ids.split(',');
    const sizes = body.sizes.split(',');

    const variants = sizes.flatMap((size) => {
        return colorIds.map((color_id) => {
            return [product.id, color_id, size, Math.round(Math.random() * 10)];
        });
    });
    const images = req.files.other_images.map((img) => [product.id, img.filename]);
    // console.log(product);
    // console.log(variants);
    // console.log(images);
    const productId = await Product.createProduct(product, variants, images);
    if (productId == -1) {
        res.status(500);
    } else {
        res.status(200).send({ productId });
    }
};

// Add function for uploading excel
const createProductExcel = async (req, res) => {
    try {
        const filePath = req.files.excel_file[0].path;
        const file = reader.readFile(filePath);
        const sheets = file.SheetNames;
        let data = [];
        let errors = [];

        for (let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
            temp.forEach((res) => {
                data.push(res);
            });
        }

        for (const item of data) {
            // Error handle for category
            if (item.category !== 'men' && item.category !== 'women' && item.category !== 'accessories') {
                errors.push(`Category must be "men", "women" or "accessories" in product: ${item.id}`);
            }

            // Error handle for price
            if (!/^\d+$/.test(item.price)) {
                errors.push(`Price must be an integer in product: ${item.id}`);
            }

            // Use timestamp as product id
            const now = new Date();
            let timestamp = now.getTime();

            const product = {
                id: timestamp,
                category: item.category,
                title: item.title,
                description: item.description,
                price: item.price,
                texture: item.texture,
                wash: item.wash,
                place: item.place,
                note: item.note,
                story: item.story,
            };
            product.main_image = item.main_image;

            // Error handle for color
            const colorIds = item.color_ids.split(',');
            for (let i = 0; i < colorIds.length; i++) {
                let colorId = colorIds[i];
                if (!/^\d+$/.test(colorId)) {
                    errors.push(`Color id must be an integer in product: ${item.id}`);
                }
                if (colorId > 14 || colorId < 1) {
                    errors.push(`Color id should only contain 1-14 in product: ${item.id}`);
                }
            }

            // Error handle for size
            const sizes = Array.isArray(item.sizes) ? item.sizes : item.sizes.split(',');
            const allowedSizes = ['XS', 'S', 'M', 'L', 'XL', 'F'];
            if (!sizes.every((size, index) => allowedSizes.includes(size) && sizes.indexOf(size) === index)) {
                errors.push(`Sizes should only contain XS, S, M, L, XL or F in uppercase and should not repeat in product: ${item.id}`);
            }

            const variants = sizes.flatMap((size) => {
                return colorIds.map((color_id) => {
                    return [product.id, color_id, size, Math.round(Math.random() * 10)];
                });
            });
            const images = item.other_images.split(',').map((img) => [product.id, img]);
            // console.log(product);
            // console.log(variants);
            // console.log(images);

            let productId;
            if (errors.length === 0) {
                productId = await Product.createProduct(product, variants, images);
            }
            if (productId === undefined) {
                console.log(`Failed to insert product ${item.id}`);
            } else {
                console.log(`Product ${product.id} inserted with ID ${productId}`);
            }
        }
        if (errors.length > 0) {
            console.log(errors);
            // Return all error messages.
            const errorMessage = errors.join('<br>\n<div style="text-indent: 000px;">');
            const errorHtml = `<div style="text-indent: 000px; color: red;">${errorMessage}<br>\
                                <div style="text-indent: 00px; color: black;">Please revise the mistake above and try it again.</div>`;
            return res.status(400).send(errorHtml);
        } else {
            const successHtml = '<div style="text-align: center; color: green">All products inserted successfully.</div>';
            return res.status(200).send(successHtml);
            // res.status(200).send('All products inserted successfully. ');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

const getProducts = async (req, res) => {
    const category = req.params.category;
    const paging = parseInt(req.query.paging) || 0;

    async function findProduct(category) {
        switch (category) {
            case 'all':
                return await Product.getProducts(pageSize, paging);
            case 'men':
            case 'women':
            case 'accessories':
                return await Product.getProducts(pageSize, paging, { category });
            case 'search': {
                const keyword = req.query.keyword;
                if (keyword) {
                    return await Product.getProducts(pageSize, paging, { keyword });
                }
                break;
            }
            case 'hot': {
                return await Product.getProducts(null, null, { category });
            }
            case 'details': {
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    return await Product.getProducts(pageSize, paging, { id });
                }
            }
        }
        return Promise.resolve({});
    }
    const { products, productCount } = await findProduct(category);
    if (!products) {
        res.status(400).send({ error: 'Wrong Request' });
        return;
    }

    if (products.length == 0) {
        if (category === 'details') {
            res.status(200).json({ data: null });
        } else {
            res.status(200).json({ data: [] });
        }
        return;
    }

    let productsWithDetail = await getProductsWithDetail(req.protocol, req.hostname, products);

    if (category == 'details') {
        productsWithDetail = productsWithDetail[0];
    }

    const result =
        productCount > (paging + 1) * pageSize
            ? {
                  data: productsWithDetail,
                  next_paging: paging + 1,
              }
            : {
                  data: productsWithDetail,
              };

    res.status(200).json(result);
};

const getProductsWithDetail = async (protocol, hostname, products) => {
    const productIds = products.map((p) => p.id);
    const variants = await Product.getProductsVariants(productIds);
    const variantsMap = _.groupBy(variants, (v) => v.product_id);
    const images = await Product.getProductsImages(productIds);
    const imagesMap = _.groupBy(images, (v) => v.product_id);

    return products.map((p) => {
        // If the image source is an online open-source, there is no need to include the imagePath for it.
        let imagePath;
        console.log(p.main_image);
        if (p.main_image.startsWith('http')) {
            imagePath = '';
        } else {
            imagePath = util.getImagePath(protocol, hostname, p.id);
        }

        p.main_image = p.main_image ? imagePath + p.main_image : null;
        p.images = p.images ? p.images.split(',').map((img) => imagePath + img) : null;

        const productVariants = variantsMap[p.id];
        if (!productVariants) {
            return p;
        }

        p.variants = productVariants.map((v) => ({
            color_code: v.code,
            size: v.size,
            stock: v.stock,
        }));

        const allColors = productVariants.map((v) => ({
            code: v.code,
            name: v.name,
        }));
        p.colors = _.uniqBy(allColors, (c) => c.code);

        const allSizes = productVariants.map((v) => v.size);
        p.sizes = _.uniq(allSizes);
        p.images = imagesMap[p.id].map((img) => imagePath + img.image);

        return p;
    });
};

module.exports = {
    createProduct,
    createProductExcel,
    getProductsWithDetail,
    getProducts,
};
