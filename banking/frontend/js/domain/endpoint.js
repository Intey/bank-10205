
export class EndPoint {

    static UserList()        { return '/api/users/'             }
    static UserDetail(id)    { return `/api/users/${id}`        }
    static Transfer(id)      { return `/api/users/${id}/money/` }

    static EventList()       { return '/api/events/'            }
    static EventDetail(id)   { return `/api/events/${id}`       }

    static TransactionList() { return '/api/transactions/'      }

    static Transfer(id)      { return `/api/users/${id}/money/` }

    static BankBalance()     { return '/api/balance'            }

    static Auth()            { return '/api/auth/'              }

}
