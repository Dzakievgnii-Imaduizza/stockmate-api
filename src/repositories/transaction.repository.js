const prisma = require('../config/prisma');

const create = async (data) => {
  return prisma.transaction.create({
    data,
    include: {
      product: true,
      user: true
    }
  });
};

const findAllByStore = async (storeId) => {
  return prisma.transaction.findMany({
    where: {
      product: {
        store_id: storeId
      }
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

const findById = async (id, storeId) => {
  return prisma.transaction.findFirst({
    where: {
      id: id,
      product: {
        store_id: storeId
      }
    },
    include: {
      product: true,
      user: true
    }
  });

};
// NEW: Count transactions between dates, filtering through the product relation
const countByDateRange = async (storeId, startDate, endDate) => {
  return prisma.transaction.count({
    where: {
      product: {
        store_id: storeId
      },
      created_at: {
        gte: startDate,
        lte: endDate
      }
    }
  });
};
const findInTransactionsByDateRange = async (storeId, startDate, endDate) => {
  return prisma.transaction.findMany({
    where: {
      product: {
        store_id: storeId
      },
      type: 'In',
      created_at: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

const findOutTransactionsByDateRange = async (storeId, startDate, endDate) => {
  return prisma.transaction.findMany({
    where: {
      product: {
        store_id: storeId
      },
      type: 'Out',
      created_at: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};
const findTransactionsByDateRange = async (storeId, startDate, endDate) => {
  return prisma.transaction.findMany({
    where: {
      product: {
        store_id: storeId
      },
      created_at: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

module.exports = {
  create,
  findAllByStore,
  findById,
  countByDateRange,
  findInTransactionsByDateRange,
  findOutTransactionsByDateRange,
  findTransactionsByDateRange
};