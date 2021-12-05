package ciclo4.retos2a5.orders;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 *
 * @author smadr
 */
@Repository
public class OrderRepository
{
    @Autowired
    private OrderRepositoryInterface repositoryInterface;

    /**
    * 
    * @param id
    * @return 
    */
    public Optional<Order> getOrderById(Integer id)
    {
        return repositoryInterface.findById(id);
    }
    
    /**
    * 
    * @return 
    */
    public List<Order> getAllOrders()
    {
        return (List<Order>) repositoryInterface.findAll();
    }

    /**
     * 
     * @param order
     * @return 
     */
    public Order saveOrder(Order order)
    {
        return repositoryInterface.save(order);
    }

    /**
     * 
     * @param order 
     */
    public void deleteOrder(Order order)
    {
       repositoryInterface.delete(order);
    }
    
    /**
    * 
    * 
     * @param id
    */    
    public void deleteOrderById(Integer id)
    { 
        repositoryInterface.deleteById(id);
    } 

    /**
    * 
    * 
     * @return 
    */     
    public Optional<Order> lastOrderId()
    {
        return repositoryInterface.findTopByOrderByIdDesc();
    }

    /**
    * 
    * 
     * @param zone
     * @return 
    */     
    public List<Order> getOrdersByZone(String zone)
    {
        return repositoryInterface.findByZone(zone);
    }

    
    /**
    * 
    * 
     * @param status
     * @return 
    */     
    public List<Order> getOrderByStatus(String status)
    {
        return repositoryInterface.findByStatus(status);
    }
    
}
