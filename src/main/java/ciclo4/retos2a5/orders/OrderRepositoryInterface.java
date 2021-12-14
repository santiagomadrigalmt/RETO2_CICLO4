package ciclo4.retos2a5.orders;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 *
 * @author smadr
 */
public interface OrderRepositoryInterface extends MongoRepository<Order,Integer>
{
    // Retorna las órdenes de pedido que coincidan con la zona recibida como parámetro:
    @Query( "{'salesMan.zone':?0}" )
    List<Order> findByZone(final String zone);
    
    // Retorna las órdenes por estados:
    @Query( "{status:?0}" )
    List<Order> findByStatus(final String status);
    
    // Para seleccionar la órden con el ID máximo:
    Optional<Order> findTopByOrderByIdDesc();
    
    
}
