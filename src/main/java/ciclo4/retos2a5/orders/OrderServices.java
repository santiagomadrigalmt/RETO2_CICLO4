package ciclo4.retos2a5.orders;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author smadr
 */
@Service
public class OrderServices
{
    /**
     *
     * @author smadr
     */
    @Autowired
    private OrderRepository repository;    
    
    /**
     *
     * @author smadr
     * @return 
     */
    public List<Order> getAllOrders()
    {
        return repository.getAllOrders();
    }

    /**
     *
     * @author smadr
     * @param id
     * @return 
     */
    public Optional<Order> getOrderById(Integer id)
    {
        return repository.getOrderById(id);
    }    
    
    /**
     *
     * @author smadr
     * @param order
     * @return 
     */
    public Order saveOrder(Order order)
    {
        Optional<Order> orderIdMax = repository.lastOrderId();
        
        if (order.getId() == null)
        {
            if (orderIdMax.isEmpty()) order.setId(1);
            else order.setId( orderIdMax.get().getId() + 1 );
        }
        
        Optional<Order> orderExists = repository.getOrderById(order.getId());
        if ( orderExists.isEmpty() )
        {
            return repository.saveOrder(order);
        }
        return order;
    }

    // Update order
    /**
     *
     * @author smadr
     * @param order
     * @return
     */
    public Order updateOrder(Order order)
    {
        if (order.getId() != null)
        {
            Optional<Order> orderExist = repository.getOrderById(order.getId());
            
            if (orderExist.isPresent())
            {
                if (order.getRegisterDay() != null) {
                    orderExist.get().setRegisterDay(order.getRegisterDay());
                }
                if (order.getStatus() != null) {
                    orderExist.get().setStatus(order.getStatus());
                }
                if (order.getSalesMan() != null) {
                    orderExist.get().setSalesMan(order.getSalesMan());
                }
                if (order.getProducts() != null) {
                    orderExist.get().setProducts(order.getProducts());
                }      
                if (order.getQuantities() != null) {
                    orderExist.get().setQuantities(order.getQuantities());
                }

                return repository.saveOrder(orderExist.get());
            } else {
                return order;
            }

        } else {
            return order;
        }
    } 
    
    
    /**
     *
     * @author smadr
     * @param id
     * @return 
     */
    public Boolean deleteOrderById(Integer id)
    {
        if ( repository.getOrderById(id).isPresent() )
        {
            repository.deleteOrderById(id);
            return true;
        }
        return false;
    }
    
    /**
     *
     * @author smadr
     * @param zone
     * @return 
     */
     public List<Order> getOrdersByZone(String zone)
     {
         return repository.getOrdersByZone(zone);
     }
     
    /**
     *
     * @author smadr
     * @param status
     * @return 
     */
     public List<Order> getOrderByStatus(String status)
     {
         return repository.getOrderByStatus(status);
     }
     
    //Métodos del reto 4
    //Reto 4: Ordenes de un asesor
    public List<Order> ordersSalesManByID(Integer id)
    {
        return repository.ordersSalesManByID(id);
    }
    //Reto 4: Ordenes de un asesor x Estado
    public List<Order> ordersSalesManByState(String state, Integer id)
    {
        return repository.ordersSalesManByState(state, id);
    }
    //Reto 4: Ordenes de un asesor x fecha
    public List<Order> ordersSalesManByDate(String dateStr, Integer id)
    {
        return repository.ordersSalesManByDate(dateStr,id);
    }     
    
}
