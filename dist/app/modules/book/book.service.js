"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const book_constant_1 = require("../profile/book.constant");
const createBook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data,
        include: {
            category: true,
        },
    });
    return result;
});
const getAllBooks = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, size } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { search, category, minPrice, maxPrice } = filters, filtersdata = __rest(filters, ["search", "category", "minPrice", "maxPrice"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: book_constant_1.BookSearchableFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filtersdata).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersdata).map((key) => ({
                [key]: {
                    equall: filtersdata[key],
                },
            })),
        });
    }
    const minPriceFloat = parseFloat(minPrice);
    const maxPriceFloat = parseFloat(maxPrice);
    if (!isNaN(minPriceFloat)) {
        andConditions.push({
            price: {
                gte: minPriceFloat,
            },
        });
    }
    if (!isNaN(maxPriceFloat)) {
        andConditions.push({
            price: {
                lte: maxPriceFloat,
            },
        });
    }
    if (category !== undefined) {
        andConditions.push({
            categoryId: {
                equals: category,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.book.findMany({
        include: {
            category: true,
        },
        where: whereConditions,
        skip,
        take: size,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {},
    });
    const total = yield prisma_1.default.book.count({
        where: whereConditions,
    });
    const totalPage = Math.ceil(total / size);
    return {
        meta: {
            total,
            page,
            size,
            totalPage,
        },
        data: result,
    };
});
const getBooksByCategoryId = (categoryId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const result = yield prisma_1.default.book.findMany({
        where: {
            category: {
                id: categoryId,
            },
        },
        include: {
            category: true,
        },
        skip,
        take: size,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {},
    });
    const total = yield prisma_1.default.book.count({
        where: {
            category: {
                id: categoryId,
            },
        },
    });
    const totalPage = Math.ceil(total / size);
    return {
        meta: {
            total,
            page,
            size,
            totalPage,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
        },
    });
    return result;
});
const updateSingleBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.BookService = {
    createBook,
    getAllBooks,
    getBooksByCategoryId,
    getSingleBook,
    updateSingleBook,
    deleteSingleBook,
};
